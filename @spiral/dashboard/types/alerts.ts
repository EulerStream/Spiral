export enum CreateAlertResult {
  SUCCESS,
  INVALID_CREATOR_ID,
  PREMIUM_PLAN_REQUIRED,
  TOO_MANY_ALERTS,
  API_KEY_NOT_FOUND,
  DUPLICATE_ALERT,
  CREATOR_NOT_FOUND,
  ERROR,
  RATE_LIMIT
}

export interface Alert {
  id: number
  api_key_id: number
  unique_id: string
  last_status: number
  checked_at: string
  created_at: string
  is_live: boolean
}

export enum CreateTargetResult {
  SUCCESS = "success",
  PREMIUM_PLAN_REQUIRED = "premium_plan_required",
  ALERT_NOT_FOUND = "alert_not_found",
  MAX_TARGETS_REACHED = "max_targets_reached",
  INVALID_TARGET_URL = "invalid_target_url",
  NO_PERMISSION = "no_permission",
  ERROR = "error"
}

export enum TestTargetResult {
  SUCCESS = "success",
  ERROR = "error",
}