# Admin Management Module

This module provides a complete admin management system for your Next.js application using Supabase. It includes user management, role management, and comprehensive audit logging.

## Features

- **Secure Admin Dashboard**: Protected `/admin` route accessible only to users with `admin` role
- **User Management**: View, edit, delete user profiles
- **Role Management**: Promote/demote users between `user` and `admin` roles
- **Audit Logging**: All admin actions are logged in the `admin_actions` table
- **Row Level Security**: Proper RLS policies ensure data security
- **Server-side Protection**: All sensitive operations require admin authentication

## Database Setup

1. **Execute the SQL Schema**: Run the contents of `database/admin_module.sql` in your Supabase SQL editor. This will:
   - Create the `admin_actions` table
   - Set up proper indexes for performance
   - Enable Row Level Security (RLS)
   - Create security policies
   - Set up the profile creation trigger

## Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Note: SUPABASE_SERVICE_ROLE_KEY is required for:
# - Promoting/demoting users (role changes)
# - Deleting users
# - This key should NEVER be exposed to client-side code
```

## Setting User Roles

### Option 1: Using Supabase SQL Editor (Recommended)

To promote a user to admin:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"user_role": "admin"}'
WHERE id = 'user-id-here';
```

To demote an admin back to regular user:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'user_role'
WHERE id = 'user-id-here';
```

### Option 2: Using Supabase Admin API

You can also use the Supabase Admin API with the service role key to update user metadata programmatically.

## Security Features

### JWT Claims
The system uses custom JWT claims to identify admin users. The `user_role` claim is embedded in the JWT and checked on every admin operation.

### Row Level Security
- **admin_actions**: Only admins can perform all operations
- **profiles**: Users can view/edit their own profiles; admins can view all profiles

### Server-side Validation
All admin operations are validated server-side using:
- Session authentication
- JWT claim verification (`user_role = 'admin'`)
- Service role key for sensitive operations

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Admin dashboard server component
│   ├── actions/
│   │   └── createAdminAction.ts  # Server action for logging
│   └── api/admin/
│       ├── promo/
│       │   └── route.ts          # Promote/demote users
│       └── user/
│           └── route.ts           # User CRUD operations
└── components/
    ├── AdminUserList.tsx         # User list component
    ├── AdminEditUser.tsx         # Edit user form
    └── ConfirmDialog.tsx         # Reusable confirmation dialog
```

## Testing

### Manual Testing Steps

1. **Create Test Users**:
   - Sign up as a regular user
   - Create another test user

2. **Set Up Admin User**:
   - Use the SQL command above to promote one user to admin
   - Or use the Supabase Dashboard to update user metadata

3. **Test Admin Access**:
   - Sign in as the admin user
   - Navigate to `/admin` - should see the admin dashboard
   - Try accessing `/admin` as a regular user - should redirect

4. **Test User Management**:
   - View user list (should see all users as admin)
   - Edit a user's profile
   - Promote/demote users
   - Delete a test user
   - Verify audit logs in the Recent Admin Actions section

5. **Test Security**:
   - Try to access admin endpoints directly without authentication
   - Try to access admin endpoints as a regular user
   - Verify RLS policies prevent unauthorized data access

### Automated Testing

You can create tests for:
- Admin route protection
- API endpoint authorization
- RLS policy enforcement
- JWT claim validation

Example test structure:
```typescript
// Test admin route protection
describe('Admin Route', () => {
  it('should redirect non-authenticated users', async () => {
    // Test without session
  })

  it('should redirect non-admin users', async () => {
    // Test with regular user session
  })

  it('should allow admin users', async () => {
    // Test with admin session
  })
})
```

## API Endpoints

### POST `/api/admin/promo`
Promote or demote a user.

**Request Body:**
```json
{
  "userId": "uuid",
  "newRole": "admin" | "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User role updated from user to admin",
  "oldRole": "user",
  "newRole": "admin"
}
```

### PUT `/api/admin/user`
Update user profile information.

**Request Body:**
```json
{
  "userId": "uuid",
  "updates": {
    "full_name": "New Name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "User profile updated successfully"
}
```

### DELETE `/api/admin/user`
Delete a user account.

**Request Body:**
```json
{
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User user@example.com deleted successfully"
}
```

## JWT Token Refresh After Role Changes

After promoting/demoting a user:

1. **For the affected user**: They need to refresh their session to get the new JWT claims
2. **For admins viewing the change**: The page needs to be refreshed to show updated data

The system handles this by:
- Requiring page refreshes after role changes
- Providing user feedback about the need to refresh

## Rollback Procedures

### Accidental Admin Promotion

If you accidentally promote a user to admin:

1. **Immediate Action**: Use the SQL command to demote them:
   ```sql
   UPDATE auth.users
   SET raw_user_meta_data = raw_user_meta_data - 'user_role'
   WHERE id = 'user-id-here';
   ```

2. **Force Sign Out**: The user may still have a valid admin JWT. You can:
   - Use Supabase Admin API to invalidate their sessions
   - Ask them to sign out and sign back in

### Database Rollback

If you need to rollback the entire admin module:

1. **Drop Tables** (use with caution):
   ```sql
   DROP TABLE IF EXISTS public.admin_actions CASCADE;
   ```

2. **Remove Policies**:
   ```sql
   DROP POLICY IF EXISTS "Admins manage actions" ON public.admin_actions;
   DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
   ```

3. **Remove Triggers**:
   ```sql
   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
   DROP FUNCTION IF EXISTS public.handle_new_user();
   ```

## Performance Considerations

- **Indexes**: Created on `admin_actions(admin_id, target_user_id)` for efficient queries
- **RLS**: Policies ensure users only see authorized data
- **Server-side Rendering**: Admin dashboard is server-rendered for better performance
- **Pagination**: Consider adding pagination for large user lists

## Best Practices

1. **Never expose service role key to client-side code**
2. **Always validate admin permissions server-side**
3. **Log all admin actions for audit purposes**
4. **Use prepared statements to prevent SQL injection**
5. **Keep JWT claims minimal and validated**
6. **Regularly review admin actions logs**
7. **Test role changes thoroughly before deploying**

## Troubleshooting

### Common Issues

1. **"Not authorized" errors**: Check that the user has `user_role: 'admin'` in their JWT claims
2. **Database connection errors**: Verify environment variables are set correctly
3. **RLS policy violations**: Ensure policies are correctly applied
4. **Service role key errors**: Verify the key has admin privileges

### Debug Steps

1. Check browser network tab for API responses
2. Verify JWT claims in browser dev tools
3. Check Supabase logs for RLS policy violations
4. Test with Supabase Dashboard SQL editor

## Support

For issues or questions about the admin module:
1. Check the audit logs in the admin dashboard
2. Verify environment variables are correctly set
3. Test with the Supabase Dashboard
4. Review the RLS policies in the SQL file
