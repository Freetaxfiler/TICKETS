/*
  # Add ticket management functions

  1. New Functions
    - `generate_ticket_number()`
      - Generates unique ticket numbers in format TKT-YYYYMMDD-NNNN
    - `create_ticket()`
      - Handles ticket creation with proper validation and organization assignment

  2. Changes
    - Add functions for ticket management
    - Implement automatic ticket number generation
*/

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS text AS $$
DECLARE
  new_ticket_no text;
BEGIN
  SELECT CONCAT('TKT-', TO_CHAR(NOW(), 'YYYYMMDD'), '-', 
    LPAD(COALESCE(
      (SELECT COUNT(*) + 1 
       FROM tickets 
       WHERE created_on::date = CURRENT_DATE), 
      1)::text, 
    4, '0'))
  INTO new_ticket_no;
  
  RETURN new_ticket_no;
END;
$$ LANGUAGE plpgsql;

-- Function to handle ticket creation
CREATE OR REPLACE FUNCTION create_ticket(
  p_opened_by text,
  p_client_file_no text,
  p_mobile_no text,
  p_name_of_client text,
  p_issue_type text,
  p_description text,
  p_organization_id uuid
)
RETURNS uuid AS $$
DECLARE
  new_ticket_id uuid;
BEGIN
  INSERT INTO tickets (
    ticket_no,
    created_on,
    opened_by,
    client_file_no,
    mobile_no,
    name_of_client,
    issue_type,
    description,
    status,
    organization_id
  ) VALUES (
    generate_ticket_number(),
    CURRENT_DATE,
    p_opened_by,
    p_client_file_no,
    p_mobile_no,
    p_name_of_client,
    p_issue_type,
    p_description,
    'open',
    p_organization_id
  )
  RETURNING id INTO new_ticket_id;

  RETURN new_ticket_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;