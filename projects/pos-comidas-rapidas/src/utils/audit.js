/**
 * Audit Logging Utility
 * Records administrative and critical actions for security and tracking
 */

export const registerAuditLog = (action, details, user = 'SISTEMA') => {
  try {
    const logs = JSON.parse(localStorage.getItem('fastpos_audit_logs') || '[]');
    
    const newLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: typeof user === 'object' ? user.name : user,
      action,
      details,
    };
    
    localStorage.setItem('fastpos_audit_logs', JSON.stringify([newLog, ...logs].slice(0, 1000)));
    console.log(`[AUDIT] ${action}: ${details} (by ${newLog.user})`);
    
    return newLog;
  } catch (error) {
    console.error('Error recording audit log:', error);
    return null;
  }
};
