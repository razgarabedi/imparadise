UPDATE users
SET 
  storage_limit = 5368709120, -- 5 GB
  storage_used = 0
WHERE 
  storage_limit IS NULL OR storage_used IS NULL; 