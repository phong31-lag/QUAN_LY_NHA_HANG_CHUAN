const { execSync } = require('child_process');

/**
 * Tự động tìm và giải phóng cổng mạng (hoạt động đa nền tảng: Windows, macOS, Linux)
 */
function giaiPhongCong(cong = 3001) {
    try {
        if (process.platform === 'win32') {
            try {
                const out = execSync(`netstat -ano | findstr :${cong} | findstr LISTENING`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
                const lines = out.trim().split('\n');
                const pids = new Set();
                for (const line of lines) {
                    const parts = line.trim().split(/\s+/);
                    const pid = parseInt(parts[parts.length - 1], 10);
                    if (pid && pid !== process.pid) {
                        pids.add(pid);
                    }
                }
                for (const pid of pids) {
                    try {
                        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
                        console.log(`🧹 [Windows] Đã tự động giải phóng tiến trình cũ (PID: ${pid}) chiếm cổng ${cong}`);
                    } catch {}
                }
            } catch {}
        } else {
            try {
                const pids = execSync(`lsof -ti :${cong} 2>/dev/null || true`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] })
                    .trim()
                    .split('\n')
                    .filter(Boolean);
                for (const pidStr of pids) {
                    const pid = parseInt(pidStr, 10);
                    if (pid && pid !== process.pid) {
                        try {
                            process.kill(pid, 'SIGKILL');
                            console.log(`🧹 [Unix] Đã tự động giải phóng tiến trình cũ (PID: ${pid}) chiếm cổng ${cong}`);
                        } catch {}
                    }
                }
            } catch {}
        }
    } catch {}
}

if (require.main === module) {
    const cong = process.argv[2] ? parseInt(process.argv[2], 10) : 3001;
    giaiPhongCong(cong);
}

module.exports = giaiPhongCong;
