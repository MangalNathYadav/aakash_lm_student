import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('pdf_file');
        const testId = formData.get('test_id');
        const testType = formData.get('test_type');
        const testDate = formData.get('test_date');
        const maxMarks = formData.get('max_marks');

        if (!file || !testId) {
            return NextResponse.json({ error: 'Missing file or test_id' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = path.join(process.cwd(), 'temp_uploads');

        // Ensure upload directory exists
        await mkdir(uploadDir, { recursive: true });

        const safeFilename = `${testId}_${Date.now()}.pdf`;
        const filePath = path.join(uploadDir, safeFilename);

        await writeFile(filePath, buffer);

        // Run Python Script
        // python admin_ingest.py <pdf_path> <test_id> <test_type> <test_date> <max_marks>
        const command = `python admin_ingest.py "${filePath}" "${testId}" "${testType}" "${testDate}" "${maxMarks}"`;

        console.log(`Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command, { cwd: process.cwd() });

        // Cleanup file
        // await unlink(filePath); // Optional: Keep for debugging for now

        if (stderr && stderr.toLowerCase().includes('error')) {
            console.error('Python Error:', stderr);
            // Don't fail immediately, usually warnings print to stderr too. 
            // Logic in python should print JSON output or success message.
        }

        return NextResponse.json({
            success: true,
            logs: stdout.split('\n').filter(line => line.trim() !== '')
        });

    } catch (error) {
        console.error('Ingestion API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
