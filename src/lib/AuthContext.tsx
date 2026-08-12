import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth as getSecondaryAuth,
  signOut as secondarySignOut
} from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, Role, UserRole, CustomRole, RolePermissions } from '../types';

export const AUTHORIZED_SUPER_ADMIN_EMAIL = 'rupeshpawar10@gmail.com';
export const AUTHORIZED_SUPER_ADMIN_NAME = 'Prof. Rupesh Pawar';

export const DEFAULT_SAMPLE_USERS: UserProfile[] = [
  {
    uid: 'super_admin_rupesh',
    email: AUTHORIZED_SUPER_ADMIN_EMAIL,
    display_name: AUTHORIZED_SUPER_ADMIN_NAME,
    role: 'super_admin',
    status: 'active',
    created_at: '2025-01-01T00:00:00.000Z'
  },
  {
    uid: 'dir_anand_pawar',
    email: 'anand.pawar@pawarijournal.org',
    display_name: 'Dr. Anand Mohan Pawar',
    role: 'director',
    status: 'active',
    created_at: '2025-01-05T10:00:00.000Z'
  },
  {
    uid: 'editorial_meena_verma',
    email: 'meena.verma@pawarijournal.org',
    display_name: 'Dr. Meena Verma',
    role: 'editorial',
    status: 'active',
    created_at: '2025-01-10T11:30:00.000Z'
  },
  {
    uid: 'editor_rajesh_sharma',
    email: 'rajesh.sharma@pawarijournal.org',
    display_name: 'Dr. Rajesh Sharma (Linguistics)',
    role: 'editor',
    status: 'active',
    created_at: '2025-01-15T14:20:00.000Z'
  },
  {
    uid: 'editorial_sunita_deshmukh',
    email: 'sunita.deshmukh@pawarijournal.org',
    display_name: 'Sunita Deshmukh',
    role: 'editorial',
    status: 'active',
    created_at: '2025-02-01T09:15:00.000Z'
  },
  {
    uid: 'reviewer_vijay_kumar',
    email: 'vijay.kumar@pawarijournal.org',
    display_name: 'Dr. Vijay Kumar (Peer Reviewer)',
    role: 'editorial',
    status: 'active',
    created_at: '2025-02-10T16:45:00.000Z'
  }
];

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
      canManageBooks: true,
      canManageBlogs: true,
      canManageOther: true,
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
      canManageBooks: true,
      canManageBlogs: true,
      canManageOther: true,
    }
  },
  {
    id: 'editorial',
    name: 'Editorial Team',
    description: 'Editorial staff with full access to articles, volumes, issues, books, blogs, and submissions.',
    is_system: true,
    permissions: {
      canManageArticles: true,
      canManageIssues: true,
      canManageSubmissions: true,
      canManagePages: true,
      canManageSettings: false,
      canManageUsers: false,
      canManageBooks: true,
      canManageBlogs: true,
      canManageOther: true,
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
      canManageBooks: true,
      canManageBlogs: true,
      canManageOther: false,
    }
  },
  {
    id: 'book_editor',
    name: 'Book Editor (किताब संपादक)',
    description: 'Specialized editor for publishing, reviewing, and managing Pawari books and literature.',
    is_system: true,
    permissions: {
      canManageArticles: false,
      canManageIssues: false,
      canManageSubmissions: false,
      canManagePages: false,
      canManageSettings: false,
      canManageUsers: false,
      canManageBooks: true,
      canManageBlogs: false,
      canManageOther: false,
    }
  },
  {
    id: 'blog_editor',
    name: 'Blog Editor (ब्लॉग संपादक)',
    description: 'Editor for writing, approving, and publishing community blogs and cultural essays.',
    is_system: true,
    permissions: {
      canManageArticles: false,
      canManageIssues: false,
      canManageSubmissions: false,
      canManagePages: false,
      canManageSettings: false,
      canManageUsers: false,
      canManageBooks: false,
      canManageBlogs: true,
      canManageOther: false,
    }
  },
  {
    id: 'other_manager',
    name: 'Other Content Manager (अन्य सामग्री प्रबंधक)',
    description: 'Manager for announcements, media, press releases, and miscellaneous CMS sections.',
    is_system: true,
    permissions: {
      canManageArticles: false,
      canManageIssues: false,
      canManageSubmissions: false,
      canManagePages: true,
      canManageSettings: false,
      canManageUsers: false,
      canManageBooks: false,
      canManageBlogs: false,
      canManageOther: true,
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
  canManageBooks: boolean;
  canManageBlogs: boolean;
  canManageOther: boolean;
  createUserProfile: (uid: string, email: string, name: string, role: Role) => Promise<void>;
  allUsers: UserProfile[];
  updateUserRole: (uid: string, role: UserRole) => Promise<void>;
  updateUserStatus: (uid: string, status: 'active' | 'inactive' | 'suspended' | 'disabled') => Promise<void>;
  updateUser: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  createUser: (email: string, pass: string, name: string, role: UserRole) => Promise<void>;
  deleteUserAccount: (uid: string) => Promise<void>;
  roles: CustomRole[];
  addCustomRole: (newRole: CustomRole) => Promise<void>;
  deleteCustomRole: (roleId: string) => Promise<void>;
  refreshRolesList: () => Promise<void>;
  refreshUsersList: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDeletedUserIds = (): string[] => {
  try {
    const raw = localStorage.getItem('pawari_deleted_users');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const markUserAsDeleted = (uid: string, email?: string) => {
  try {
    const current = getDeletedUserIds();
    const updated = new Set(current);
    if (uid) updated.add(uid);
    if (email) updated.add(email.toLowerCase().trim());
    localStorage.setItem('pawari_deleted_users', JSON.stringify(Array.from(updated)));
  } catch (e) {}
};

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
      allUsers.filter(u => u.role === (roleId as any)).forEach(async (u) => {
        try {
          await setDoc(doc(db, 'users', u.uid), { role: 'editorial' }, { merge: true });
        } catch (e) {}
      });
    } catch (e) {}

    const updated = roles.filter(r => r.id !== roleId);
    setRoles(updated);
    try { localStorage.setItem('local_roles_cache', JSON.stringify(updated)); } catch (e) {}
    await refreshRolesList();
    await refreshUsersList();
  };

  // Helper to fetch all users for Super Admin / Staff management view
  const refreshUsersList = async () => {
    // Role & auth check: Only fetch full users collection if user is authenticated and is staff
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }

    const email = currentUser.email?.toLowerCase().trim() || '';
    const isSuperAdmin = email === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase();

    const savedUserStr = localStorage.getItem('pawari_cms_user');
    let currentRole = userProfile?.role;
    if (!currentRole && savedUserStr) {
      try {
        currentRole = JSON.parse(savedUserStr)?.role;
      } catch (e) {}
    }

    const isStaff = isSuperAdmin || ['super_admin', 'director', 'editorial', 'editor'].includes(currentRole || '');
    if (!isStaff) {
      return;
    }

    try {
      const deletedIds = getDeletedUserIds();
      const isDeleted = (uUid: string, uEmail?: string) => {
        if (uUid && deletedIds.includes(uUid)) return true;
        if (uEmail && deletedIds.includes(uEmail.toLowerCase().trim())) return true;
        return false;
      };

      const snap = await getDocs(collection(db, 'users'));
      const list: UserProfile[] = [];
      snap.forEach(d => {
        const u = d.data() as UserProfile;
        const effectiveUid = u.uid || d.id;
        if (!isDeleted(effectiveUid, u.email)) {
          list.push({
            ...u,
            uid: effectiveUid
          });
        }
      });

      if (list.length === 0) {
        // Seed default sample users into Firestore ONLY if super admin
        if (isSuperAdmin) {
          const sampleToSeed: UserProfile[] = [];
          for (const u of DEFAULT_SAMPLE_USERS) {
            if (!isDeleted(u.uid, u.email)) {
              sampleToSeed.push(u);
              try {
                await setDoc(doc(db, 'users', u.uid), u, { merge: true });
              } catch (e) {
                console.warn('Error seeding default user:', u.email, e);
              }
            }
          }
          setAllUsers(sampleToSeed);
        }
      } else {
        setAllUsers(list);
      }
    } catch (err) {
      console.warn('refreshUsersList safe warning:', err);
      const deletedIds = getDeletedUserIds();
      setAllUsers(DEFAULT_SAMPLE_USERS.filter(u => !deletedIds.includes(u.uid) && !deletedIds.includes(u.email.toLowerCase().trim())));
    }
  };

  useEffect(() => {
    // Check local storage session first
    const savedLocalUser = localStorage.getItem('pawari_cms_user');
    if (savedLocalUser) {
      try {
        const parsed = JSON.parse(savedLocalUser);
        if (parsed && parsed.email && parsed.status !== 'disabled') {
          setUserProfile(parsed);
        } else {
          localStorage.removeItem('pawari_cms_user');
        }
      } catch (e) {
        localStorage.removeItem('pawari_cms_user');
      }
    }

    // Load initial roles list (do not fetch users list until user is authenticated as staff)
    refreshRolesList();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const email = user.email?.toLowerCase().trim() || '';
        
        if (email === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
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
          // Check if user exists in Firestore users collection
          try {
            const userDocRef = doc(db, 'users', user.uid);
            let snap = await getDoc(userDocRef);
            let matchedProfile: UserProfile | null = snap.exists() ? (snap.data() as UserProfile) : null;

            if (!matchedProfile && email) {
              const q = query(collection(db, 'users'), where('email', '==', email));
              const qSnap = await getDocs(q);
              qSnap.forEach(d => {
                const u = d.data() as UserProfile;
                if (u.email?.toLowerCase().trim() === email) {
                  matchedProfile = u;
                }
              });
            }

            if (matchedProfile && (matchedProfile as UserProfile).status !== 'disabled') {
              const profile: UserProfile = {
                uid: user.uid,
                email: matchedProfile.email || email,
                display_name: matchedProfile.display_name || user.displayName || email,
                role: matchedProfile.role || 'editorial',
                status: 'active',
                created_at: matchedProfile.created_at || new Date().toISOString()
              };
              await setDoc(userDocRef, profile, { merge: true });
              setUserProfile(profile);
              localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
              await refreshUsersList();
            } else {
              console.warn('Unauthorized or disabled CMS user blocked:', email);
              await firebaseSignOut(auth);
              localStorage.removeItem('pawari_cms_user');
              setCurrentUser(null);
              setUserProfile(null);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Error in profile validation:', err);
            await firebaseSignOut(auth);
            localStorage.removeItem('pawari_cms_user');
            setCurrentUser(null);
            setUserProfile(null);
          }
        }
      } else {
        // If not authenticated via Firebase Auth, retain local session if valid
        const saved = localStorage.getItem('pawari_cms_user');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed && parsed.email && parsed.status !== 'disabled') {
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
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const res = await signInWithPopup(auth, provider);
      const user = res.user;

      if (!user || !user.email) {
        await firebaseSignOut(auth);
        localStorage.removeItem('pawari_cms_user');
        setUserProfile(null);
        setCurrentUser(null);
        throw new Error('Sign in failed: No email returned from Google.');
      }

      const signedInEmail = user.email.toLowerCase().trim();
      if (signedInEmail === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
        const profile: UserProfile = {
          uid: user.uid,
          email: AUTHORIZED_SUPER_ADMIN_EMAIL,
          display_name: AUTHORIZED_SUPER_ADMIN_NAME,
          role: 'super_admin',
          status: 'active',
          created_at: new Date().toISOString()
        };
        try {
          await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
        } catch (e) {}
        setUserProfile(profile);
        localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
        await refreshUsersList();
        return;
      }

      // Check if user exists in users collection
      let matchedProfile: UserProfile | null = null;
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists()) {
          matchedProfile = snap.data() as UserProfile;
        } else if (signedInEmail) {
          const q = query(collection(db, 'users'), where('email', '==', signedInEmail));
          const qSnap = await getDocs(q);
          qSnap.forEach(d => {
            const u = d.data() as UserProfile;
            if (u.email?.toLowerCase().trim() === signedInEmail) {
              matchedProfile = u;
            }
          });
        }
      } catch (e) {}

      // Fallback check in default sample staff
      if (!matchedProfile) {
        const sample = DEFAULT_SAMPLE_USERS.find(s => s.email.toLowerCase().trim() === signedInEmail);
        if (sample) matchedProfile = sample;
      }

      if (matchedProfile && (matchedProfile as UserProfile).status !== 'disabled') {
        const profile: UserProfile = {
          uid: user.uid,
          email: signedInEmail,
          display_name: matchedProfile.display_name || user.displayName || signedInEmail,
          role: matchedProfile.role || 'editorial',
          status: 'active',
          created_at: matchedProfile.created_at || new Date().toISOString()
        };
        try {
          await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
        } catch (e) {}
        setUserProfile(profile);
        localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
        await refreshUsersList();
      } else {
        await firebaseSignOut(auth);
        localStorage.removeItem('pawari_cms_user');
        setUserProfile(null);
        setCurrentUser(null);
        throw new Error(`Unauthorized account (${signedInEmail}). Access is restricted to registered CMS staff.`);
      }
    } catch (err: any) {
      if (err?.code === 'auth/unauthorized-domain' || (err?.message && err.message.includes('auth/unauthorized-domain'))) {
        const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
        throw new Error(`AUTH_UNAUTHORIZED_DOMAIN:${currentDomain}`);
      }
      throw err;
    }
  };

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail || !pass) {
      throw new Error('Please enter both email address and password.');
    }

    // 1. First attempt login via standard Firebase Auth
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, pass);
      return;
    } catch (firebaseErr: any) {
      console.warn('Firebase Auth login skipped/failed, falling back to database check:', firebaseErr);
    }

    // 2. Fallback check against Firestore user accounts & default staff accounts
    try {
      let matchedUser: UserProfile | null = null;

      try {
        const q = query(collection(db, 'users'), where('email', '==', cleanEmail));
        const qSnap = await getDocs(q);
        qSnap.forEach(d => {
          const u = d.data() as UserProfile;
          if (u.email?.toLowerCase().trim() === cleanEmail) {
            matchedUser = u;
          }
        });
      } catch (dbErr) {
        console.warn('Firestore user search warning:', dbErr);
      }

      if (!matchedUser) {
        const foundSample = DEFAULT_SAMPLE_USERS.find(u => u.email.toLowerCase().trim() === cleanEmail);
        if (foundSample) {
          matchedUser = foundSample;
        }
      }

      if (matchedUser) {
        const u = matchedUser;
        if (u.status === 'disabled' || u.status === 'suspended') {
          throw new Error('This account has been disabled or suspended. Please contact the administrator.');
        }

        // Super Admin must log in via Google Sign-In (Gmail) unless a password was explicitly set and matches
        if (cleanEmail === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase()) {
          if (u.password && u.password === pass) {
            // Password matches explicitly set password
          } else {
            throw new Error('Super Admin access is restricted to Google Sign-In (Gmail). Please switch to the "Google Sign-In (Gmail)" tab.');
          }
        } else if (u.password && u.password !== pass) {
          throw new Error('Incorrect password. Please verify your password.');
        }

        const profile: UserProfile = {
          uid: u.uid || `user_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
          email: u.email,
          display_name: u.display_name,
          role: u.role || 'editorial',
          status: 'active',
          password: u.password,
          created_at: u.created_at || new Date().toISOString()
        };

        try {
          await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
        } catch (e) {}

        setUserProfile(profile);
        localStorage.setItem('pawari_cms_user', JSON.stringify(profile));
        await refreshUsersList();
        return;
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('disabled') || err.message.includes('password') || err.message.includes('suspended') || err.message.includes('Google Sign-In'))) {
        throw err;
      }
    }

    throw new Error('Incorrect email address or password. Access is allowed only for registered CMS users.');
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
    const cleanEmail = email.trim().toLowerCase();
    let newUid = '';

    try {
      const secondaryApp = getApps().find(a => a.name === 'SecondaryAuthApp') || initializeApp(firebaseConfig, 'SecondaryAuthApp');
      const secondaryAuth = getSecondaryAuth(secondaryApp);
      const res = await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, pass);
      newUid = res.user.uid;
      await secondarySignOut(secondaryAuth);
    } catch (err: any) {
      console.warn('Secondary auth user creation warning:', err);
      if (err?.code === 'auth/email-already-in-use') {
        throw new Error(`User with email "${cleanEmail}" already exists in Firebase Auth.`);
      }
      if (err?.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password provider is disabled in Firebase Console. Please enable "Email/Password" under Firebase Console > Authentication > Sign-in method.');
      }
      if (err?.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters long.');
      }
      newUid = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    }

    const newProf: UserProfile = {
      uid: newUid,
      email: cleanEmail,
      display_name: name.trim(),
      role,
      status: 'active',
      password: pass,
      created_at: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', newUid), newProf, { merge: true });
    await refreshUsersList();
  };

  const deleteUserAccount = async (uid: string) => {
    try {
      const targetUser = allUsers.find(u => u.uid === uid);
      const targetEmail = targetUser?.email?.toLowerCase().trim();

      // Persist deletion record so user is never re-seeded
      markUserAsDeleted(uid, targetEmail);

      // Direct document deletion
      try {
        await deleteDoc(doc(db, 'users', uid));
      } catch (e) {
        console.warn('Direct deleteDoc failed:', e);
      }

      // Query and remove any matching Firestore document in 'users' collection
      try {
        if (targetEmail) {
          const q = query(collection(db, 'users'), where('email', '==', targetEmail));
          const snap = await getDocs(q);
          for (const d of snap.docs) {
            await deleteDoc(doc(db, 'users', d.id));
          }
        }
      } catch (e) {
        console.warn('Scan deleteDoc warning:', e);
      }

      // Immediately filter local state so UI updates instantly
      setAllUsers(prev => prev.filter(u => u.uid !== uid && (targetEmail ? u.email?.toLowerCase().trim() !== targetEmail : true)));

      await refreshUsersList();
    } catch (err) {
      console.error('deleteUserAccount error:', err);
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

  const updateUserStatus = async (uid: string, status: 'active' | 'inactive' | 'suspended' | 'disabled') => {
    try {
      await setDoc(doc(db, 'users', uid), { status }, { merge: true });
      setAllUsers(prev => prev.map(u => u.uid === uid ? { ...u, status } : u));
      await refreshUsersList();
    } catch (err) {
      console.error('updateUserStatus error:', err);
      throw err;
    }
  };

  const updateUser = async (uid: string, updates: Partial<UserProfile>) => {
    try {
      await setDoc(doc(db, 'users', uid), updates, { merge: true });
      await refreshUsersList();
    } catch (err) {
      console.error('updateUser error:', err);
      throw err;
    }
  };

  const demoLogin = async (role: Role) => {
    await directSuperAdminLogin();
  };

  const currentRoleObj = roles.find(r => r.id === (userProfile?.role || 'public'));
  const role = userProfile?.role || 'public';

  const isSuperAdmin = role === 'super_admin' || userProfile?.email?.toLowerCase() === AUTHORIZED_SUPER_ADMIN_EMAIL.toLowerCase();
  const isDirector = isSuperAdmin || role === 'director';
  const isEditorial = isDirector || role === 'editorial' || role === 'editor';

  const canManageUsers = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManageUsers ?? true);
  const canManageSettings = isSuperAdmin || isDirector || (currentRoleObj?.permissions?.canManageSettings ?? false);
  const canManageArticles = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManageArticles ?? false);
  const canManageIssues = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManageIssues ?? false);
  const canManagePages = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManagePages ?? false);
  const canManageSubmissions = isSuperAdmin || isDirector || isEditorial || (currentRoleObj?.permissions?.canManageSubmissions ?? false);
  const canManageBooks = isSuperAdmin || isDirector || isEditorial || role === 'book_editor' || (currentRoleObj?.permissions?.canManageBooks ?? true);
  const canManageBlogs = isSuperAdmin || isDirector || isEditorial || role === 'blog_editor' || (currentRoleObj?.permissions?.canManageBlogs ?? true);
  const canManageOther = isSuperAdmin || isDirector || isEditorial || role === 'other_manager' || (currentRoleObj?.permissions?.canManageOther ?? true);

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
        canManageBooks,
        canManageBlogs,
        canManageOther,
        createUserProfile,
        allUsers,
        updateUserRole,
        updateUserStatus,
        updateUser,
        createUser,
        deleteUserAccount,
        roles,
        addCustomRole,
        deleteCustomRole,
        refreshRolesList,
        refreshUsersList
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

