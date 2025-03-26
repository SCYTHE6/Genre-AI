import * as fs from 'fs/promises';
import * as path from 'path';
import { exec as execPromise } from 'child_process';

const USE_MAGENTA = true; // Toggle between Magenta and Spleeter transformations

export async function transformAudio(
  inputFilePath: string,
  outputFilePath: string,
  targetGenre: string
): Promise<boolean> {
  try {
    console.log(`Starting audio transformation to ${targetGenre}...`);
    
    // Choose which transform script to use
    const scriptPath = USE_MAGENTA 
      ? path.join(process.cwd(), 'ml_scripts', 'magenta_transform.py')
      : path.join(process.cwd(), 'ml_scripts', 'spleeter_transform.py');
    
    const cmd = `${path.join(process.cwd(), 'ml_scripts', 'run_spleeter.bat')} ${scriptPath} "${inputFilePath}" "${outputFilePath}" "${targetGenre}"`;
    
    console.log(`Executing command: ${cmd}`);
    
    const { stdout, stderr } = await execPromise(cmd, { timeout: 300000 });
    console.log('------ START PYTHON OUTPUT ------');
    console.log(stdout);
    console.log('------ END PYTHON OUTPUT ------');

    if (stderr && typeof stderr === 'string' && stderr.trim().length > 0) {
      console.log('------ START PYTHON ERRORS ------');
      console.error(stderr);
      console.log('------ END PYTHON ERRORS ------');
    }
    
    return true;
  } catch (error) {
    console.error('Error transforming audio:', error);
    
    // Fallback - just copy the file if transformation fails
    try {
      await fs.copyFile(inputFilePath, outputFilePath);
      console.log('Fallback: Copied original file to output location');
      return false;
    } catch (copyError) {
      console.error('Error during fallback copy:', copyError);
      throw copyError;
    }
  }
}