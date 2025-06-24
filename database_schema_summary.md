# GastroHub Database Schema & RLS Summary

_Last updated: 2025-06-23 23:28 +02:00_

---

## ⚡️ Table of Contents
- [Tables & Columns](#tables--columns)
- [RLS (Row Level Security) Policy Status](#rls-row-level-security-policy-status)
- [Security Warnings & Recommendations](#security-warnings--recommendations)

---

## Tables & Columns

> **Note:** Only a sample of columns per table is shown for brevity. For full details, query the Supabase dashboard or request a CSV dump.

### inventory
| Column         | Type    | Nullable | Default                |
|---------------|---------|----------|------------------------|
| id            | uuid    | NO       | gen_random_uuid()      |
| supplier_id   | uuid    | NO       |                        |
| listing_id    | uuid    | YES      |                        |
| product_name  | text    | NO       |                        |
| description   | text    | YES      |                        |
| category_id   | uuid    | YES      |                        |
| ...           | ...     | ...      | ...                    |

### push_notification_tokens
| Column     | Type      | Nullable | Default                                    |
|------------|-----------|----------|--------------------------------------------|
| id         | bigint    | NO       | nextval('push_notification_tokens_id_seq') |
| user_id    | uuid      | NO       |                                            |
| token      | text      | NO       |                                            |
| created_at | timestamptz | YES    | now()                                      |

_...many more tables omitted for brevity._

---

## RLS (Row Level Security) Policy Status

| Table                       | RLS Enabled | Policies Exist? |
|-----------------------------|-------------|-----------------|
| business_hour               | Yes         | ❌ None         |
| cart_item                   | Yes         | ❌ None         |
| conversation                | Yes         | ❌ None         |
| custom_category             | Yes         | ❌ None         |
| delivery_task               | Yes         | ❌ None         |
| favorite                    | Yes         | ❌ None         |
| inventory                   | Yes         | ❌ None         |
| invoice                     | Yes         | ❌ None         |
| listing                     | Yes         | ❌ None         |
| message                     | Yes         | ❌ None         |
| notification                | Yes         | ❌ None         |
| order                       | Yes         | ❌ None         |
| payment_method              | Yes         | ❌ None         |
| push_notification_tokens    | Yes         | ❌ None         |
| review                      | Yes         | ❌ None         |
| subscription_plans          | Yes         | ❌ None         |
| user_subscriptions          | Yes         | ❌ None         |

> **Warning:** RLS is enabled on these tables, but no policies are defined. This can lead to unexpected access issues or, depending on defaults, security gaps. See Supabase docs for remediation: [RLS Policy Docs](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy)

---

## Security Warnings & Recommendations

- **Mutable search_path in functions:**
  - Functions `handle_new_user`, `update_updated_at_column` have a mutable search_path. [Remediation](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- **Auth OTP expiry:**
  - Email OTP expiry is set to more than 1 hour (recommended: < 1 hour). [Remediation](https://supabase.com/docs/guides/platform/going-into-prod#security)
- **Leaked password protection:**
  - Leaked password protection is **disabled**. [Remediation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

---

_This file was auto-generated. For a full, up-to-date schema, use the Supabase dashboard or CLI._
