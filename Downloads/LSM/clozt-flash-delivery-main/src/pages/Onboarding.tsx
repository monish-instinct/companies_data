import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Sparkles, MapPin, Check, Upload, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const isDemoUser = !!(user && typeof (user as any).id === 'string' && (user as any).id.startsWith('demo-'));

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;

      if (isDemoUser) {
        try {
          const key = `demoProfile:${(user as any).id}`;
          const raw = localStorage.getItem(key);
          if (raw) {
            const demoProfile = JSON.parse(raw);
            if (demoProfile?.onboarding_completed) {
              navigate("/dashboard");
              return;
            }
          }
        } catch {}
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single();

        if (profile?.onboarding_completed) {
          navigate("/dashboard");
          return;
        }
      }
    };

    checkOnboardingStatus();
  }, [user, isDemoUser, navigate]);

  const styles = [
    { id: "formal", name: "Formal", emoji: "👔" },
    { id: "casual", name: "Casual", emoji: "👕" },
    { id: "ethnic", name: "Ethnic", emoji: "🥻" },
    { id: "sporty", name: "Sporty", emoji: "🏃" },
    { id: "trendy", name: "Trendy", emoji: "✨" },
    { id: "streetwear", name: "Streetwear", emoji: "🧥" },
    { id: "luxury", name: "Luxury", emoji: "💎" },
    { id: "athleisure", name: "Athleisure", emoji: "🏋️" },
  ];

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev =>
      prev.includes(styleId)
        ? prev.filter(s => s !== styleId)
        : [...prev, styleId]
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !user) return null;
    if (isDemoUser) {
      // Skip remote upload in demo mode
      return null;
    }

    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile, { upsert: true });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSkip = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleContinue = async () => {
    if (step === 1) {
      // Save basic profile info
      if (!profileData.name || !profileData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in your name and phone number",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      // Save everything to database or demo storage
      setIsUploading(true);
      try {
        let avatarUrl = null as string | null;
        if (avatarFile) {
          avatarUrl = await uploadAvatar();
        }

        if (isDemoUser) {
          // Demo mode: store profile locally and mark onboarding completed
          const key = `demoProfile:${(user as any).id}`;
          const demoProfile = {
            name: profileData.name,
            phone: profileData.phone,
            gender: profileData.gender || null,
            date_of_birth: profileData.dateOfBirth || null,
            avatar_url: avatarUrl,
            style_preferences: {
              categories: selectedStyles,
              brands: [],
              sizes: {},
            },
            onboarding_completed: true,
          };
          try {
            localStorage.setItem(key, JSON.stringify(demoProfile));
          } catch {}

          toast({
            title: "Profile Completed!",
            description: "Welcome to CLOZET",
          });
          navigate("/dashboard");
          return;
        }

        const { error } = await supabase
          .from('profiles')
          .update({
            name: profileData.name,
            phone: profileData.phone,
            gender: profileData.gender || null,
            date_of_birth: profileData.dateOfBirth || null,
            avatar_url: avatarUrl,
            style_preferences: {
              categories: selectedStyles,
              brands: [],
              sizes: {},
            },
            onboarding_completed: true,
          })
          .eq('user_id', user?.id);

        if (error) throw error;

        toast({
          title: "Profile Completed!",
          description: "Welcome to CLOZET",
        });

        navigate("/dashboard");
      } catch (error) {
        console.error("Error saving profile:", error);
        toast({
          title: "Error",
          description: "Failed to save profile. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };


  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'} transition-colors`} />
          </div>
          <p className="text-center text-sm text-muted-foreground">Step {step} of 3</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-strong p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
                  <p className="text-muted-foreground">
                    Tell us about yourself to personalize your experience
                  </p>
                </div>

                {/* Avatar Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full glass-strong flex items-center justify-center overflow-hidden">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-16 h-16 text-muted-foreground" />
                      )}
                    </div>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      <Upload className="w-5 h-5 text-primary-foreground" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Upload profile picture</p>
                </div>

                {/* Profile Form */}
                <div className="space-y-4 mb-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="John Doe"
                      className="glass mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="glass mt-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={profileData.gender} onValueChange={(value) => setProfileData({ ...profileData, gender: value })}>
                        <SelectTrigger className="glass mt-2">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                        className="glass mt-2"
                      />
                    </div>
                  </div>
                </div>


                <div className="flex gap-4">
                  <Button
                    variant="glass"
                    className="flex-1"
                    onClick={handleSkip}
                  >
                    Skip
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleContinue}
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-strong p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">What's Your Style?</h1>
                  <p className="text-muted-foreground">
                    Select your preferred clothing styles to personalize your experience
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {styles.map((style) => (
                    <motion.button
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={`glass p-6 rounded-xl text-center transition-all duration-300 relative ${
                        selectedStyles.includes(style.id)
                          ? 'glass-strong ring-2 ring-primary'
                          : 'hover:glass-strong'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {selectedStyles.includes(style.id) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-4xl mb-2">{style.emoji}</div>
                      <div className="text-sm font-medium">{style.name}</div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="glass"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleContinue}
                  >
                    Continue
                  </Button>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Card className="glass-strong p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h1 className="text-3xl font-bold mb-2">Enable Location</h1>
                  <p className="text-muted-foreground">
                    We'll use your location to show nearby stores and faster delivery options
                  </p>
                </div>

                <div className="glass p-6 rounded-xl mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Why we need your location</h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                          Find stores near you
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                          Get accurate delivery estimates
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                          Enable express 60-min delivery
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="glass"
                    className="flex-1"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleContinue}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full mr-2" />
                        Saving...
                      </>
                    ) : "Complete Setup"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
