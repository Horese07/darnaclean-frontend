import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaApple, FaUnlink } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';

interface SocialAccount {
  provider: string;
  connected: boolean;
  email: string;
  avatar?: string;
}

export const SocialAccountsManager: React.FC = () => {
  const { getSocialAccounts, disconnectSocial } = useAuth();
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  useEffect(() => {
    loadSocialAccounts();
  }, []);

  const loadSocialAccounts = async () => {
    try {
      setIsLoading(true);
      const result = await getSocialAccounts();
      if (result?.success) {
        setAccounts(result.data.accounts);
      }
    } catch (error) {
      console.error('Failed to load social accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (provider: string) => {
    try {
      setDisconnecting(provider);
      const success = await disconnectSocial();
      if (success) {
        await loadSocialAccounts(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to disconnect social account:', error);
    } finally {
      setDisconnecting(null);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <FcGoogle className="h-5 w-5" />;
      case 'facebook':
        return <FaFacebook className="h-5 w-5 text-blue-600" />;
      case 'apple':
        return <FaApple className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'facebook':
        return 'Facebook';
      case 'apple':
        return 'Apple';
      default:
        return provider;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your social login accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your social login accounts</CardDescription>
      </CardHeader>
      <CardContent>
        {accounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No social accounts connected</p>
            <p className="text-sm">Connect your social accounts for faster login</p>
          </div>
        ) : (
          <div className="space-y-4">
            {accounts.map((account) => (
              <div key={account.provider} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getProviderIcon(account.provider)}
                  <div>
                    <div className="font-medium">{getProviderName(account.provider)}</div>
                    <div className="text-sm text-muted-foreground">{account.email}</div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    Connected
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnect(account.provider)}
                  disabled={disconnecting === account.provider}
                  className="text-destructive hover:text-destructive"
                >
                  {disconnecting === account.provider ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <FaUnlink className="h-4 w-4 mr-2" />
                      Disconnect
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-6" />

        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Benefits of connecting social accounts:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Faster login without remembering passwords</li>
            <li>Secure authentication through trusted providers</li>
            <li>Automatic profile picture and basic information</li>
            <li>Easy account recovery options</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
