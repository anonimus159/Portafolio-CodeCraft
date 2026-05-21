import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ThermalPrinter, PrinterTypes, CharacterSet } from 'node-thermal-printer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getPrinterInstance(cfg) {
  const printerName = cfg['printer.nombre'] || '';
  const printerType = cfg['printer.tipo'] === 'STAR' ? PrinterTypes.STAR : PrinterTypes.EPSON;

  if (!printerName) {
    throw new Error('Impresora no configurada. Ve a Configuración y establece el nombre de la impresora.');
  }

  // Crear carpeta temporal en la raíz del proyecto para archivos temporales de impresión
  const tempDir = path.join(__dirname, '../../temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempFile = path.join(tempDir, `print_${Date.now()}_${Math.random().toString(36).substring(7)}.bin`);

  const printer = new ThermalPrinter({
    type: printerType,
    interface: tempFile,
    characterSet: CharacterSet.PC850_MULTILINGUAL,
    removeSpecialCharacters: false,
    lineCharacter: '-',
  });

  const originalExecute = printer.execute.bind(printer);

  // Sobrescribir execute para que mande el archivo generado al spooler de Windows vía PowerShell
  printer.execute = async function() {
    await originalExecute();

    return new Promise((resolve, reject) => {
      const psScriptPath = path.join(__dirname, 'raw-print.ps1');
      // Reemplazar diagonales invertidas para compatibilidad con Windows en CMD/PowerShell
      const formattedScriptPath = psScriptPath.replace(/\//g, '\\');
      const formattedTempFile = tempFile.replace(/\//g, '\\');
      
      const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -File "${formattedScriptPath}" -printerName "${printerName}" -filePath "${formattedTempFile}"`;

      exec(cmd, (err, stdout, stderr) => {
        // Eliminar archivo temporal
        try {
          if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
        } catch (unlinkErr) {
          console.error('[PRINTER] Error eliminando archivo temporal:', unlinkErr);
        }

        if (err) {
          console.error('[PRINTER] Error de spooler Windows:', stderr || err.message);
          return reject(new Error(`Error al imprimir en Windows: ${stderr || err.message}`));
        }
        resolve(stdout);
      });
    });
  };

  return printer;
}

export function checkPrinterStatus(printerName) {
  return new Promise((resolve) => {
    if (!printerName) {
      return resolve({
        configured: false,
        connected: false,
        message: 'Impresora no configurada.'
      });
    }

    const cmd = `powershell -NoProfile -Command "Get-Printer -Name '${printerName}' | Select-Object Name, PrinterStatus, WorkOffline | ConvertTo-Json"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return resolve({
          configured: true,
          connected: false,
          message: `La impresora "${printerName}" no está registrada en Windows.`
        });
      }

      try {
        const status = JSON.parse(stdout);
        const isOffline = status.WorkOffline === true;
        resolve({
          configured: true,
          connected: !isOffline,
          message: isOffline 
            ? `La impresora "${printerName}" está configurada pero desconectada.`
            : `La impresora "${printerName}" está lista y en línea.`
        });
      } catch (parseErr) {
        resolve({
          configured: true,
          connected: true,
          message: `Impresora "${printerName}" configurada.`
        });
      }
    });
  });
}

export function getSystemPrinters() {
  return new Promise((resolve) => {
    const cmd = `powershell -NoProfile -Command "Get-Printer | Select-Object Name | ConvertTo-Json"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) return resolve([]);
      try {
        const rawData = JSON.parse(stdout);
        const printers = Array.isArray(rawData)
          ? rawData.map(p => p.Name)
          : (rawData && rawData.Name ? [rawData.Name] : []);
        // Filtrar nombres vacíos
        resolve(printers.filter(Boolean));
      } catch (parseErr) {
        // En caso de que sea un string simple no-JSON
        const lines = stdout.split('\n').map(l => l.trim()).filter(l => l && l !== 'Name' && !l.startsWith('---'));
        resolve(lines);
      }
    });
  });
}
