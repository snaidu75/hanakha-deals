import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ytsvyxytwrphdwhweumi.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0c3Z5eHl0d3JwaGR3aHdldW1pIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQwMjMxOSwiZXhwIjoyMDY3OTc4MzE5fQ.1oZZmrZE5x56h8QEv3kAPXSQAX4uKaFw0U0EkJqHXTs'; // Replace this

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// 👇 Add user IDs (from auth.users) you want to delete
const userIds = [
    'f196dba4-9c29-4675-b828-c37f0543edda',

];

const deleteUsers = async () => {
    for (const userId of userIds) {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) {
            console.error(`❌ Failed to delete user ${userId}:`, error.message);
        } else {
            console.log(`✅ Successfully deleted user ${userId}`);
        }
    }
};

deleteUsers();
