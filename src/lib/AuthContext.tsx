import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, Role, UserRole, CustomRole, RolePermissions } from '../types';

export const AUTHORIZED_SUPER_ADMIN_EMAIL = 'rupeshpawar10@gmail.com';
export const AUTHORIZED_SUPER_ADMIN_NAME = 'Prof. Rupesh Pawar';

export const DEFAULT_SYSTEM_ROLES: CustomRole[] = [
  {
    id: 'super_admin',
    name: 'Super Admin',
    description: 'Full administrative authority over all CMS settings, users, roles, and content.',
    is_system: true,
    permissions: {
      canManageArticles: true,
      canManageIssues: true,
      canManageSubmissions: true,
      canManagePages: true,
      canManageSettings: true,
      canManageUsers: true,
    }
  },
  {
    id: 'director',
    name: 'Director / Patron',
    description: 'Executive journal leadership managing settings, volumes, issues, and pages.',
    is_system: true,
    permissions: {
      canManageArticles: true,
      canManageIssues: true,
      canManageSubmissions: true,
      canManagePages: true,
      canManageSettings: true,
      canManageUsers: false,
    }
  },
  {
    id: 'editorial',
    name: 'Editorial Team',
    description: 'Editorial staff with full access to articles, volumes, issues, and peer submissions.',
    is_system: true,
    permissions: {
      canManageArticles: true,
      canManageIssues: true,
      canManageSubmissions: true,
      canManagePages: true,
      canManageSettings: false,
      canManageUsers: false,
    }
  },
  {
    id: 'editor',
    name: 'Section Editor',
    description: 'Content editor responsible for manuscript reviewing and article curation.',
    is_system: true,
    permissions: {
      canManageArticles: true,
      canManageIssues: false,
      canManageSubmissions: true,
      canManagePages: false,
      canManageSettings: false,
      canManageUsers: false,
    }
  }
];

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: (role: Role) => Promise<void>;
  directSuperAdminLogin: (email?: string, name?: string) => Promise<void>;
  isSuperAdmin: boolean;
  isDirector: boolean;
  isEditorial: boolean;
  canManageUsers: boolean;
  canManageSettings: boolean;
  canManageArticles: boolean;
  canManageIssues: boolean;
  canManagePages: boolean;
  canManageSubmissions: boolean;
  createUserProfile: (uid: string, email: string, name: string, role: Role) => Promise<void>;
  allUsers: UserProfile[];
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  createUser: (email: string, pass: string, name: string, role: UserRole) => Promise<void>;
  roles: CustomRole[];
  addCustomRole: (newRole: CustomRole) => Promise<void>;
  deleteCustomRole: (roleId: string) => Promise<void>;
  refreshRolesList: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [roles, setRoles] = useState<CustomRole[]>(DEFAULT_SYSTEM_ROLES);
  const [loading, setLoading] = useState(true);

  // Helper to fetch all roles from Firestore collection
  const refreshRolesList = async () => {
    try {
      const snap = await getDocs(collection(db, 'roles'));
      const list: CustomRole[] = [];
      snap.forEach(d => list.push(d.data() as CustomRole));

      const mergedMap = new Map<string, CustomRole>();
      DEFAULT_SYSTEM_ROLES.forEach(r => mergedMap.set(r.id, r));
      list.forEach(r => mergedMap.set(r.id, r));

      const combinedList = Array.from(mergedMap.values());
      setRoles(combinedList);
      try { localStorage.setItem('local_roles_cache', JSON.stringify(combinedList)); } catch (e) {}
    } catch (err) {
      const cached = localStorage.getItem('local_roles_cache');
      if (cached) {
        try {
          setRoles(JSON.parse(cached));
          return;
        } catch (e) {}
      }
      setRoles(DEFAULT_SYSTEM_ROLES);
    }
  };

  const addCustomRole = async (newRole: CustomRole) => {
    const roleWithDate: CustomRole = {
      ...newRole,
      created_at: newRole.created_at || new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'roles', roleWithDate.id), roleWithDate, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc role warning:', err);
    }
    const updated = roles.filter(r => r.id !== roleWithDate.id);
    updated.push(roleWithDate);
    setRoles(updated);
    try { localStorage.setItem('local_roles_cache', JSON.stringify(updated)); } catch (e) {}
    await refreshRolesList();
  };

  const deleteCustomRole = async (roleId: string) => {
    const target = roles.find(r => r.id === roleId);
    if (target?.is_system) {
      throw new Error('System default roles cannot be deleted.');
    }

    try {
      await deleteDoc(doc(db, 'roles', roleId));
    } catch (err) {
      console.warn('Firestore deleteDoc role warning:', err);
    }

    // Reassign users with deleted role back to editorial
    try {
      const snap = await getDocs(collection(db, 'users'));
      snap.forEach(async (uDoc) => {
        const uData = uDoc.data() as UserProfile;
        if (uData.role === roleId) {
          await setDoc(doc(db, 'users', uDoc.id), { role: 'editorial' }, { merge: true });
        }
      });
    } catch (e) {}

    const updated = roles.filter(r => r.id !== roleId);
    setRoles(updated);
    try { localStorage.setItem('local_roles_cache', JSON.stringify(updated)); } catch (e) {}
    await refreshRolesList();
    await refreshUsersList();
  };

  // Helper to fetch all users for Super Admin management view
  const refreshUsersList = async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach(d => list.push(d.data() as UserProfile));
      if (list.length > 0) {
        setAllUsers(list);
      } else {
        setAllUsers([{
          uid: 'super_admin_rupesh',
          email: AUTHORIZED_SUPER_ADMIN_EMAIL,
          display_name: AUTHORIZED_SUPER_ADMIN_NAME,
          role: 'super_admin',
          status: 'active',
          created_at: new Date().toISOString()
        }]);
      }
    } catch (err) {
      setAllUsers([{
        uid: 'super_admin_rupesh',
        email: AUTHORIZED_SUPER_ADMIN_EMAIL,
        display_name: AUTHORIZED_SUPER_ADMIN_NAME,
        role: 'super_admin',
        status: 'active',
        created_at: new Date().toISOString()
      }]);
    }
  };

  useEffect(() => {
    // Check local storage session first
    const savedLocalUser = localStorage.getItem('pawari_cms_user');
    if (savedLocalUser) {
      try {
        const parsed = JSON.parse(savedLocalUser);
        if (parsed?.email?.toLowerCase() === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
          setUserProfile(parsed);
        } else {
          localStorage.removeItem('pawari_cms_user');
        }
      } catch (e) {
        localStorage.removeItem('pawari_cms_user');
      }
    }

    // Load initial roles list
    refreshRolesList();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const email = user.email?.toLowerCase().trim();
        if (email !== AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
          console.warn('Unauthorized user blocked:', user.email);
          await firebaseSignOut(auth);
          localStorage.removeItem('pawari_cms_user');
          setCurrentUser(null);
          setUserProfile(null);
          setLoading(false);
          return;
        }

        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          const profile: UserProfile = {
            uid: user.uid,
            email: AUTHORIZED_SUPER_ADMIN_EMAIL,
            display_name: AUTHORIZED_SUPER_ADMIN_NAME,
            role: 'super_admin',
            status: 'active',
            created_at: snap.exists() ? (snap.data().created_at || new Date().toISOString()) : new Date().toISOString()
          };
          await setDoc(userDocRef, profile, { merge: true });
          setUserProfile(profile);
          localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
          await refreshUsersList();
        } catch (err) {
          console.error('Error in onAuthStateChanged profile sync:', err);
          const profile: UserProfile = {
            uid: user.uid,
            email: AUTHORIZED_SUPER_ADMIN_EMAIL,
            display_name: AUTHORIZED_SUPER_ADMIN_NAME,
            role: 'super_admin',
            status: 'active',
            created_at: new Date().toISOString()
          };
          setUserProfile(profile);
        }
      } else {
        // If not authenticated via Firebase, retain local session ONLY if it's the approved super admin
        const saved = localStorage.getItem('pawari_cms_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed?.email?.toLowerCase() === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
              setUserProfile(parsed);
            } else {
              setUserProfile(null);
              localStorage.removeItem('pawari_cms_user');
            }
          } catch (e) {
            setUserProfile(null);
          }
        } else {
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const res = await signInWithPopup(auth, provider);
    const user = res.user;

    if (!user || !user.email) {
      await firebaseSignOut(auth);
      localStorage.removeItem('pawari_cms_user');
      setUserProfile(null);
      setCurrentUser(null);
      throw new Error('Unauthorized admin account. No email address returned from Google.');
    }

    const signedInEmail = user.email.toLowerCase().trim();
    if (signedInEmail !== AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
      await firebaseSignOut(auth);
      localStorage.removeItem('pawari_cms_user');
      setUserProfile(null);
      setCurrentUser(null);
      throw new Error(`Unauthorized admin account (${user.email}). Admin access is strictly allowed only for ${AUTHORIZED_SUPER_ADMIN_EMAIL}.`);
    }

    // Email matches rupeshpawar10@gmail.com! Create / update Firestore users/{uid}
    const profile: UserProfile = {
      uid: user.uid,
      email: AUTHORIZED_SUPER_ADMIN_EMAIL,
      display_name: AUTHORIZED_SUPER_ADMIN_NAME,
      role: 'super_admin',
      status: 'active',
      created_at: new Date().toISOString()
    };

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, profile, { merge: true });
    } catch (err) {
      console.warn('Firestore setDoc warning:', err);
    }

    setUserProfile(profile);
    localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
    await refreshUsersList();
  };

  const login = async (email: string, pass: string) => {
    if (email.toLowerCase().trim() !== AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
      throw new Error(`Unauthorized admin account. Access is restricted to ${AUTHORIZED_SUPER_ADMIN_EMAIL}.`);
    }
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const directSuperAdminLogin = async (customEmail?: string, customName?: string) => {
    const targetEmail = AUTHORIZED_SUPER_ADMIN_EMAIL;
    const targetName = AUTHORIZED_SUPER_ADMIN_NAME;
    const uid = 'admin_' + targetEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
    
    const profile: UserProfile = {
      uid,
      email: targetEmail,
      display_name: targetName,
      role: 'super_admin',
      status: 'active',
      created_at: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', uid), profile, { merge: true });
    } catch (err) {
      console.warn('Direct admin Firestore sync warning:', err);
    }

    setUserProfile(profile);
    localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
    await refreshUsersList();
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Signout warning:', e);
    }
    localStorage.removeItem('pawari_cms_user');
    setCurrentUser(null);
    setUserProfile(null);
  };

  const createUserProfile = async (uid: string, email: string, name: string, role: Role) => {
    const profile: UserProfile = {
      uid,
      email: AUTHORIZED_SUPER_ADMIN_EMAIL,
      display_name: AUTHORIZED_SUPER_ADMIN_NAME,
      role: 'super_admin',
      status: 'active',
      created_at: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', uid), profile, { merge: true });
    } catch (err) {
      console.warn('Error saving user profile to Firestore:', err);
    }
    setUserProfile(profile);
    localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
    await refreshUsersList();
  };

  const createUser = async (email: string, pass: string, name: string, role: UserRole) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const newProf: UserProfile = {
        uid: res.user.uid,
        email,
        display_name: name,
        role,
        status: 'active',
        created_at: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', res.user.uid), newProf, { merge: true });
      await refreshUsersList();
    } catch (err: any) {
      console.error('createUser error:', err);
      throw err;
    }
  };

  const updateUserRole = async (uid: string, role: UserRole) => {
    try {
      await setDoc(doc(db, 'users', uid), { role }, { merge: true });
      await refreshUsersList();
    } catch (err) {
      console.error('updateUserRole error:', err);
    }
  };

  const demoLogin = async (role: Role) => {
    await directSuperAdminLogin();
  };

  const currentRoleObj = roles.find(r => r.id === (userProfile?.role || 'public'));
  const role = userProfile?.role || 'public';

  const isSuperAdmin = role === 'super_admin';
  const isDirector = isSuperAdmin || role === 'director';
  const isEditorial = isDirector || role === 'editorial' || role === 'editor';

  const canManageUsers = isSuperAdmin || (currentRoleObj?.permissions?.canManageUsers ?? false);
  const canManageSettings = isSuperAdmin || isDirector || (currentRoleObj?.permissions?.canManageSettings ?? false);
  const canManageArticles = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManageArticles ?? false);
  const canManageIssues = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManageIssues ?? false);
  const canManagePages = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManagePages ?? false);
  const canManageSubmissions = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManageSubmissions ?? false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        login,
        googleLogin,
        logout,
        demoLogin,
        directSuperAdminLogin,
        isSuperAdmin,
        isDirector,
        isEditorial,
        canManageUsers,
        canManageSettings,
        canManageArticles,
        canManageIssues,
        canManagePages,
        canManageSubmissions,
        createUserProfile,
        allUsers,
        updateUserRole,
        createUser,
        roles,
        addCustomRole,
        deleteCustomRole,
        refreshRolesList
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

