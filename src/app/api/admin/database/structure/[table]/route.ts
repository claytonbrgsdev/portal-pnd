import { NextRequest, NextResponse } from 'next/server'

type TableColumn = {
  column_name: string
  data_type: string
  is_nullable: string
  column_default: string | null
}

type TableStructures = {
  [key: string]: TableColumn[]
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ table: string }> }
) {
  const params = await context.params
  try {
    const tableName = params.table

    // Return hardcoded structure for known tables
    // Add your custom table structures here
    const tableStructures: TableStructures = {
      'profiles': [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
        { column_name: 'email', data_type: 'text', is_nullable: 'YES', column_default: null },
        { column_name: 'full_name', data_type: 'text', is_nullable: 'YES', column_default: null },
        { column_name: 'role', data_type: 'text', is_nullable: 'YES', column_default: "'user'" },
        { column_name: 'created_at', data_type: 'timestamptz', is_nullable: 'YES', column_default: 'now()' },
        { column_name: 'updated_at', data_type: 'timestamptz', is_nullable: 'YES', column_default: 'now()' }
      ],
      'admin_actions': [
        { column_name: 'id', data_type: 'bigint', is_nullable: 'NO', column_default: 'nextval(\'admin_actions_id_seq\'::regclass)' },
        { column_name: 'admin_id', data_type: 'uuid', is_nullable: 'YES', column_default: null },
        { column_name: 'action', data_type: 'text', is_nullable: 'NO', column_default: null },
        { column_name: 'target_user_id', data_type: 'uuid', is_nullable: 'YES', column_default: null },
        { column_name: 'payload', data_type: 'jsonb', is_nullable: 'YES', column_default: "'{}'::jsonb" },
        { column_name: 'created_at', data_type: 'timestamptz', is_nullable: 'YES', column_default: 'now()' }
      ],
      'users': [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
        { column_name: 'email', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'encrypted_password', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'email_confirmed_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'invited_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'confirmation_token', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'confirmation_sent_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'recovery_token', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'recovery_sent_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'email_change_token_new', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'email_change', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'email_change_sent_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'last_sign_in_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'raw_app_meta_data', data_type: 'jsonb', is_nullable: 'YES', column_default: "'{}'::jsonb" },
        { column_name: 'raw_user_meta_data', data_type: 'jsonb', is_nullable: 'YES', column_default: "'{}'::jsonb" },
        { column_name: 'is_super_admin', data_type: 'boolean', is_nullable: 'YES', column_default: null },
        { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'updated_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'phone', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'phone_confirmed_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'phone_change', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'phone_change_token', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'phone_change_sent_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'email_change_token_current', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'email_change_confirm_status', data_type: 'smallint', is_nullable: 'YES', column_default: '0' },
        { column_name: 'banned_until', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'reauthentication_token', data_type: 'character varying', is_nullable: 'YES', column_default: null },
        { column_name: 'reauthentication_sent_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'is_sso_user', data_type: 'boolean', is_nullable: 'NO', column_default: 'false' },
        { column_name: 'deleted_at', data_type: 'timestamp with time zone', is_nullable: 'YES', column_default: null },
        { column_name: 'is_anonymous', data_type: 'boolean', is_nullable: 'NO', column_default: 'false' }
      ],
      'buckets': [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
        { column_name: 'name', data_type: 'text', is_nullable: 'NO', column_default: null },
        { column_name: 'owner', data_type: 'uuid', is_nullable: 'YES', column_default: null },
        { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'NO', column_default: 'now()' },
        { column_name: 'updated_at', data_type: 'timestamp with time zone', is_nullable: 'NO', column_default: 'now()' },
        { column_name: 'public', data_type: 'boolean', is_nullable: 'YES', column_default: 'false' }
      ],
      'objects': [
        { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
        { column_name: 'bucket_id', data_type: 'uuid', is_nullable: 'YES', column_default: null },
        { column_name: 'name', data_type: 'text', is_nullable: 'YES', column_default: null },
        { column_name: 'owner', data_type: 'uuid', is_nullable: 'YES', column_default: null },
        { column_name: 'created_at', data_type: 'timestamp with time zone', is_nullable: 'NO', column_default: 'now()' },
        { column_name: 'updated_at', data_type: 'timestamp with time zone', is_nullable: 'NO', column_default: 'now()' },
        { column_name: 'last_accessed_at', data_type: 'timestamp with time zone', is_nullable: 'NO', column_default: 'now()' },
        { column_name: 'metadata', data_type: 'jsonb', is_nullable: 'YES', column_default: null },
        { column_name: 'path_tokens', data_type: 'text[]', is_nullable: 'YES', column_default: null }
      ]
      // Add your custom table structures here:
      // Example of how to add a custom table:
      // 'your_custom_table': [
      //   { column_name: 'id', data_type: 'uuid', is_nullable: 'NO', column_default: null },
      //   { column_name: 'title', data_type: 'text', is_nullable: 'NO', column_default: null },
      //   { column_name: 'description', data_type: 'text', is_nullable: 'YES', column_default: null },
      //   { column_name: 'status', data_type: 'text', is_nullable: 'YES', column_default: "'draft'" },
      //   { column_name: 'created_at', data_type: 'timestamptz', is_nullable: 'YES', column_default: 'now()' },
      //   { column_name: 'updated_at', data_type: 'timestamptz', is_nullable: 'YES', column_default: 'now()' }
      // ]
    }

    const columns = tableStructures[tableName] || []

    return NextResponse.json({
      success: true,
      columns: columns
    })

  } catch (error) {
    console.error('Error in database structure API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
