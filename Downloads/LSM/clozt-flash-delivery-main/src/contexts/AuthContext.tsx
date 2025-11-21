import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithOTP: (identifier: string, isPhone: boolean) => Promise<{ error: string | null }>;
  verifyOTP: (identifier: string, otp: string, isPhone: boolean) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadPersistedDemoUser = () => {
      try {
        const raw = localStorage.getItem('demoUser');
        if (raw) {
          const demo = JSON.parse(raw);
          setUser(demo as any);
        }
      } catch {}
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
        } else {
          // No Supabase session; fall back to persisted demo user if present
          loadPersistedDemoUser();
        }
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setUser(session.user);
      } else {
        // No Supabase session; try demo user
        loadPersistedDemoUser();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOTP = async (identifier: string, isPhone: boolean) => {
    try {
      // Demo mode for presentation - use demo@clozet.com to bypass real OTP
      if (identifier.toLowerCase() === 'demo@clozet.com' || identifier.startsWith('demo')) {
        toast({
          title: "Demo Mode Activated",
          description: "Use any 6-digit code to continue (e.g., 123456)",
        });
        return { error: null };
      }

      if (isPhone) {
        // Demo phone OTP - no SMS provider; show demo code
        toast({
          title: "OTP Sent",
          description: "Use demo code 123456 to continue.",
        });
        return { error: null };
      } else {
        // Real email OTP through Supabase
        const { error } = await supabase.auth.signInWithOtp({
          email: identifier,
          options: {
            emailRedirectTo: `${window.location.origin}/onboarding`,
          }
        });
        
        if (error) throw error;
        
        toast({
          title: "OTP Sent",
          description: `Check ${identifier} for your verification code.`,
        });
        return { error: null };
      }
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const verifyOTP = async (identifier: string, otp: string, isPhone: boolean) => {
    try {
      // Demo mode - allow any OTP for demo emails
      if (identifier.toLowerCase() === 'demo@clozet.com' || identifier.startsWith('demo')) {
        if (otp.length === 6) {
          // Create a demo session
          const demoUser = {
            id: 'demo-user-' + Date.now(),
            email: identifier,
            created_at: new Date().toISOString(),
          };
          
          // Persist demo session locally so ProtectedRoute recognizes it after redirects
          try {
            localStorage.setItem('demoUser', JSON.stringify(demoUser));
          } catch {}

          // Check if demo profile exists, create if not
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', demoUser.id)
            .single();

          if (!existingProfile) {
            await supabase
              .from('profiles')
              .insert({
                user_id: demoUser.id,
                name: 'Demo User',
                onboarding_completed: false,
              });
          }

          setUser(demoUser as any);
          
          toast({
            title: "Demo Login Successful! 🎉",
            description: "Welcome to CLOZET Demo",
          });

          // Check onboarding status
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('user_id', demoUser.id)
            .single();

          if (profile?.onboarding_completed) {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/onboarding';
          }

          return { error: null };
        } else {
          return { error: "Please enter a 6-digit code" };
        }
      }

      if (isPhone) {
        // Demo phone OTP verification
        if (otp === '123456') {
          const demoUser = {
            id: 'demo-phone-' + identifier,
            email: null,
            phone: identifier,
            created_at: new Date().toISOString(),
          } as any;

          // Persist demo session locally so ProtectedRoute recognizes it after redirects
          try {
            localStorage.setItem('demoUser', JSON.stringify(demoUser));
          } catch {}

          // Check if demo profile exists, create if not
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', demoUser.id)
            .single();

          if (!existingProfile) {
            await supabase
              .from('profiles')
              .insert({
                user_id: demoUser.id,
                name: 'Demo Phone User',
                phone: identifier,
                onboarding_completed: false,
              });
          }

          setUser(demoUser);

          // Redirect based on onboarding status
          const { data: profile } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('user_id', demoUser.id)
            .single();

          if (profile?.onboarding_completed) {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/onboarding';
          }

          toast({
            title: "Login Successful",
            description: "Phone demo login",
          });

          return { error: null };
        }
        toast({
          title: "Invalid OTP",
          description: "Please enter 123456",
          variant: "destructive",
        });
        return { error: "Invalid OTP" };
      }
      
      // Real OTP verification through Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: identifier,
        token: otp,
        type: 'email'
      });

      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive"
        });
        return { error: error.message };
      }

      // Check if profile exists and onboarding is completed
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', data.user?.id)
        .single();

      toast({
        title: "Login Successful",
        description: "Welcome to CLOZET!",
      });
      
      // Redirect based on onboarding status
      if (profile?.onboarding_completed) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/onboarding';
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    try {
      localStorage.removeItem('demoUser');
    } catch {}
    setUser(null);
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  const value = {
    user,
    session,
    loading,
    signInWithOTP,
    verifyOTP,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};