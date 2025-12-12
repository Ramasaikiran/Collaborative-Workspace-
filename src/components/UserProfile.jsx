import React, { useState } from 'react';
import { User } from '@/entities/User';
import { UploadFile } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, Save, X, User as UserIcon } from 'lucide-react';

export default function UserProfile({ user, onClose }) {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    bio: user.bio || '',
    phone: user.phone || '',
    department: user.department || '',
    profile_picture: user.profile_picture || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      handleChange('profile_picture', file_url);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await User.updateMyUserData(formData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20">
            {formData.profile_picture ? (
              <AvatarImage src={formData.profile_picture} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl">
                {user.full_name?.[0] || user.email?.[0] || 'U'}
              </AvatarFallback>
            )}
          </Avatar>
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
        {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700">Full Name</label>
          <Input
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium text-slate-700">Email</label>
          <Input value={user.email} disabled className="bg-gray-50" />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Department</label>
          <Input
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
            placeholder="Enter your department"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            placeholder="Tell us about yourself..."
            className="min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline">{user.role}</Badge>
        <Badge className="bg-blue-100 text-blue-700">Active Member</Badge>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          <X className="w-4 h-4 mr-2" /> Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" /> {isLoading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </form>
  );
}