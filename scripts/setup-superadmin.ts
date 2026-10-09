import 'dotenv/config';
import { db } from '../lib/db';
import { createAdminClient } from '../lib/supabase/admin';

async function setupSuperAdmin() {
  const email = 'info@naagnoolup.com';
  const password = 'superadmin@7577';
  const fullName = 'Super Admin';
  const role = 'SUPERADMIN';

  console.log(`Setting up Super Admin: ${email}...`);

  const supabaseAdmin = createAdminClient();

  // 1. Check if user already exists in Supabase Auth
  const { data: usersList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('Failed to list Supabase users:', listError);
  }

  const existingAuthUser = usersList?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  );

  let authUserId: string;

  if (existingAuthUser) {
    console.log(`Found existing auth user: ${existingAuthUser.id}. Updating password and metadata...`);
    const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingAuthUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: { role, full_name: fullName, name: fullName },
      }
    );
    if (updateError) {
      throw updateError;
    }
    authUserId = updated.user.id;
  } else {
    console.log('Creating new auth user in Supabase Auth...');
    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role, full_name: fullName, name: fullName },
    });
    if (createError) {
      throw createError;
    }
    authUserId = created.user.id;
  }

  console.log(`Supabase Auth user ID: ${authUserId}`);

  // 2. Upsert in PostgreSQL application database
  const user = await db.user.upsert({
    where: { email },
    create: {
      id: authUserId,
      email,
      fullName,
      role: 'SUPERADMIN',
    },
    update: {
      id: authUserId,
      fullName,
      role: 'SUPERADMIN',
    },
  });

  console.log(`Super Admin user synchronized in PostgreSQL:`, user);
}

setupSuperAdmin()
  .then(() => {
    console.log('Super Admin setup completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error setting up Super Admin:', err);
    process.exit(1);
  });
