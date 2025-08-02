
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface PageLoaderProps {
  loading: boolean;
}

const PageLoader = ({ loading }: PageLoaderProps) => {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    if (loading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          // Gradually increase progress with decreasing speed as it approaches 90%
          if (prevProgress >= 90) {
            clearInterval(timer);
            return 90;
          }
          const increment = Math.max(1, 30 * (1 - prevProgress / 100));
          return Math.min(90, prevProgress + increment);
        });
      }, 100);
      
      return () => {
        clearInterval(timer);
        // Complete the progress when the component unmounts
        setProgress(100);
      };
    } else {
      // Quickly complete the progress when loading finishes
      setProgress(100);
      const timer = setTimeout(() => setProgress(0), 500);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (!loading && progress === 0) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-opacity duration-300",
      progress === 100 ? "opacity-0" : "opacity-100"
    )}>
      <div className="flex flex-col items-center">
        <Progress 
          value={progress} 
          className="w-full h-1 rounded-none animate-pulse bg-transparent" 
        />
        {progress < 100 && (
          <div className="absolute top-2 right-2">
            <Loader className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PageLoader;
