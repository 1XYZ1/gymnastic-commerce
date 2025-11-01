import { type ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CustomLogo } from '@/components/custom/CustomLogo';
import { OAuthButtons } from './OAuthButtons';
import { AuthFormFooter } from './AuthFormFooter';
import { AuthFormImage } from './AuthFormImage';

interface AuthFormLayoutProps {
  description: string;
  children: ReactNode;
  showOAuth?: boolean;
}

export const AuthFormLayout = ({
  description,
  children,
  showOAuth = true,
}: AuthFormLayoutProps) => {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <CustomLogo />
                <p className="text-balance text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Form content (passed as children) */}
              {children}

              {/* OAuth section */}
              {showOAuth && (
                <>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      O continúa con
                    </span>
                  </div>
                  <OAuthButtons />
                </>
              )}
            </div>
          </div>

          {/* Side image */}
          <AuthFormImage />
        </CardContent>
      </Card>

      {/* Footer */}
      <AuthFormFooter />
    </div>
  );
};
