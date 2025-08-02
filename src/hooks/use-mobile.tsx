
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Check if window is defined (to avoid SSR issues)
    if (typeof window === 'undefined') return;
    
    // Create a function to check if the device is mobile
    const checkIfMobile = () => {
      const mobileBrowserCheck = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobileBrowserCheck);
      
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
    
    // Set initial state
    checkIfMobile()
    
    // Create handler for window resize with debounce
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkIfMobile();
      }, 100); // 100ms debounce
    }
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    }
  }, [isInitialized])

  return isMobile
}
