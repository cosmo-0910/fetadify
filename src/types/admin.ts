export interface AdminUser {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface AdminPermission {
  id: string;
  admin_id: string;
  permission_type: string;
  can_view: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface AdminSession {
  id: string;
  admin_id: string;
  session_token: string;
  expires_at: string;
}

export interface Order {
  id: string;
  name: string | null;
  email: string | null;
  selected_services: string | null;
  service_price: number | null;
  message: string | null;
  status: string | null;
  admin_notified: boolean | null;
  sent_at: string | null;
  created_at: string;
  accepted_by_admin: string | null;
  accepted_at: string | null;
  admin_notes: string | null;
  progress: number | null;
  currency: string | null;
  due_date: string | null;
  social_media_details: any | null;
}
