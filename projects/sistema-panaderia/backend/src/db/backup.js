const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const pool = require('./connection');
const config = require('../config');

const BACKUP_DIR = path.join(process.cwd(), 'backups');
const MAX_BACKUPS = 10;

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function getFechaFilename() {
  const now = new Date();
  return `backup_${now.toISOString().replace(/[:.]/g, '-').substring(0, 19)}`;
}

async function createBackup() {
  const filename = `${getFechaFilename()}.sql`;
  const filepath = path.join(BACKUP_DIR, filename);
  
  const mysqldump = `mysqldump -h${config.db.host} -u${config.db.user}${config.db.password ? `-p${config.db.password}` : ''} ${config.db.database} > "${filepath}"`;
  
  return new Promise((resolve, reject) => {
    exec(mysqldump, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error creando backup:', error.message);
        reject(error);
        return;
      }
      
      console.log(`✅ Backup creado: ${filename}`);
      
      cleanOldBackups();
      
      resolve(filepath);
    });
  });
}

function cleanOldBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('backup_') && f.endsWith('.sql'))
      .map(f => ({ name: f, path: path.join(BACKUP_DIR, f), time: fs.statSync(path.join(BACKUP_DIR, f)).mtime }))
      .sort((a, b) => b.time - a.time);
    
    if (files.length > MAX_BACKUPS) {
      files.slice(MAX_BACKUPS).forEach(f => {
        fs.unlinkSync(f.path);
        console.log(`🗑️ Backup antiguo eliminado: ${f.name}`);
      });
    }
  } catch (error) {
    console.error('Error limpiando backups:', error.message);
  }
}

function restoreBackup(filename) {
  const filepath = path.join(BACKUP_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    throw new Error(`Backup no encontrado: ${filename}`);
  }
  
  const mysql = `mysql -h${config.db.host} -u${config.db.user}${config.db.password ? `-p${config.db.password}` : ''} ${config.db.database} < "${filepath}"`;
  
  return new Promise((resolve, reject) => {
    exec(mysql, (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Error restaurando backup:', error.message);
        reject(error);
        return;
      }
      
      console.log(`✅ Backup restaurado: ${filename}`);
      resolve(filepath);
    });
  });
}

async function getBackupsList() {
  try {
    const files = fs.readdirSync(BACKUP_DIR)
      .filter(f => f.startsWith('backup_') && f.endsWith('.sql'))
      .map(f => ({ name: f, size: fs.statSync(path.join(BACKUP_DIR, f)).size, created: fs.statSync(path.join(BACKUP_DIR, f)).mtime }))
      .sort((a, b) => b.created - a.created);
    
    return files;
  } catch (error) {
    console.error('Error listando backups:', error.message);
    return [];
  }
}

setInterval(() => {
  createBackup().catch(console.error);
}, 24 * 60 * 60 * 1000);

createBackup().catch(console.error);

module.exports = {
  createBackup,
  restoreBackup,
  getBackupsList,
  cleanOldBackups,
  BACKUP_DIR
};