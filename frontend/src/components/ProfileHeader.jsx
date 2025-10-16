import { useState, useRef, useEffect } from 'react';
import { LogOutIcon, VolumeOffIcon, Volume2Icon } from 'lucide-react';

// 1. IMPORT FIX: Import specific hooks for useQuery/useMutation
import { useLogout, useUpdateProfile } from '../hooks/useAuth';

// 2. IMPORT FIX: Import the Zustand store for client-side state
import { useChatStore } from '../store/useChatStore';
// Assuming useAuthStore contains authUser (if you are not using useCheckAuth query result)
import { useAuthStore } from '../store/useAuthStore';

const mouseClickSound = new Audio('/sounds/mouse-click.mp3');

function ProfileHeader() {
  // 3. HOOK USAGE FIX: Call the dedicated hooks
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  // 4. ZUSTAND STATE FIX: Get state and actions directly from the store
  const authUser = useAuthStore((state) => state.authUser);
  const { isSoundEnabled, toggleSound } = useChatStore((state) => ({
    isSoundEnabled: state.isSoundEnabled,
    toggleSound: state.toggleSound,
  }));

  // Use state to show the pending profile image (optimistic local preview)
  const [selectedImg, setSelectedImg] = useState(null);

  // Sync local state with global user state on initial load or update
  useEffect(() => {
    // Clear local preview if the global user object updates (e.g., successful mutation)
    setSelectedImg(null);
  }, [authUser?.profilePic]);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const base64Image = reader.result;
      // 5. Optimistic Local Preview: Set the local state immediately
      setSelectedImg(base64Image);

      // 6. MUTATION CALL FIX: Call the destructured 'updateProfile' function
      updateProfile({ profilePic: base64Image });
    };
  };

  return (
    <div className='p-6 border-b border-slate-700/50'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          {/* AVATAR */}
          <div className={`avatar ${authUser ? 'online' : ''}`}>
            <button
              type='button'
              className={`size-14 rounded-full overflow-hidden relative group ${
                isUpdatingProfile ? 'cursor-not-allowed opacity-70' : ''
              }`}
              onClick={() => {
                if (isUpdatingProfile) return;
                fileInputRef.current?.click();
              }}
              disabled={isUpdatingProfile}
            >
              <img
                // Display local preview, then authUser pic, then default
                src={selectedImg || authUser?.profilePic || '/avatar.png'}
                alt='User image'
                className='size-full object-cover'
              />
              {/* Overlay only shows when not updating */}
              {!isUpdatingProfile && (
                <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                  <span className='text-white text-xs'>Change</span>
                </div>
              )}
              {isUpdatingProfile && (
                <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                  <Loader2 className='size-6 text-white animate-spin' />
                </div>
              )}
            </button>

            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              onChange={handleImageUpload}
              className='hidden'
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className='text-slate-200 font-medium text-base max-w-[180px] truncate'>
              {authUser?.fullName ?? 'User'}
            </h3>
            {/* Only show "Online" if user data exists */}
            {authUser && <p className='text-slate-400 text-xs'>Online</p>}
          </div>
        </div>

        {/* BUTTONS */}
        <div className='flex gap-4 items-center'>
          {/* LOGOUT BTN */}
          <button
            type='button'
            className='text-slate-400 hover:text-slate-200 transition-colors'
            onClick={() => {
              try {
                mouseClickSound.currentTime = 0;
                mouseClickSound.play().catch(() => {});
              } catch (e) {}
              // 7. MUTATION CALL FIX: Call the destructured 'logout' function
              logout();
            }}
            // 8. LOADING STATE FIX: Use the destructured 'isLoggingOut' property
            disabled={isLoggingOut}
            aria-disabled={isLoggingOut}
          >
            <LogOutIcon className='size-5' />
          </button>

          {/* SOUND TOGGLE BTN */}
          <button
            type='button'
            className='text-slate-400 hover:text-slate-200 transition-colors'
            onClick={() => {
              try {
                mouseClickSound.currentTime = 0;
                mouseClickSound.play().catch(() => {});
              } catch (e) {}
              toggleSound();
            }}
          >
            {isSoundEnabled ? (
              <Volume2Icon className='size-5' />
            ) : (
              <VolumeOffIcon className='size-5' />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ProfileHeader;
