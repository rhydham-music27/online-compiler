import subprocess
import tempfile
import os
import time
import psutil
from fastapi import HTTPException

class CodeExecutor:
    @staticmethod
    def get_memory_usage(proc_id):
        try:
            process = psutil.Process(proc_id)
            return process.memory_info().rss / (1024 * 1024)  # MB
        except:
            return 0

    @classmethod
    def execute(cls, code: str, language: str, input_data: str = ""):
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        env["LANG"] = "en_US.UTF-8"

        with tempfile.TemporaryDirectory() as tmpdir:
            file_ext = {
                "python": "py",
                "cpp": "cpp",
                "javascript": "js"
            }.get(language, "txt")

            # Java: filename MUST match the public class name (case-sensitive)
            if language == "java":
                file_path = os.path.join(tmpdir, "Main.java")
            else:
                file_path = os.path.join(tmpdir, f"main.{file_ext}")
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(code)

            input_file = os.path.join(tmpdir, "input.txt")
            with open(input_file, "w", encoding="utf-8") as f:
                f.write(input_data)

            # Prepare commands
            if language == "python":
                cmd = ["python", file_path]
            elif language == "cpp":
                compile_cmd = ["g++", file_path, "-o", os.path.join(tmpdir, "main.out")]
                compile_res = subprocess.run(compile_cmd, capture_output=True, text=True, encoding="utf-8", env=env)
                if compile_res.returncode != 0:
                    return {"stdout": "", "stderr": compile_res.stderr, "exit_code": compile_res.returncode, "time": 0, "memory": 0, "samples": []}
                cmd = [os.path.join(tmpdir, "main.out")]
            elif language == "java":
                compile_cmd = ["javac", "-encoding", "utf-8", file_path]
                compile_res = subprocess.run(compile_cmd, capture_output=True, text=True, encoding="utf-8", env=env)
                if compile_res.returncode != 0:
                    return {"stdout": "", "stderr": compile_res.stderr, "exit_code": compile_res.returncode, "time": 0, "memory": 0, "samples": []}
                cmd = ["java", "-cp", tmpdir, "Main"]
            elif language == "javascript":
                cmd = ["node", file_path]
            else:
                raise HTTPException(status_code=400, detail="Language not supported")

            # Execute and Continuous Profiling
            start_time = time.perf_counter()
            samples = []
            
            try:
                with open(input_file, "r", encoding="utf-8") as f_in:
                    process = subprocess.Popen(
                        cmd,
                        stdin=f_in,
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True,
                        encoding="utf-8",
                        env=env
                    )
                    
                    # High-frequency sampling loop
                    while process.poll() is None:
                        current_time = (time.perf_counter() - start_time) * 1000
                        mem = cls.get_memory_usage(process.pid)
                        samples.append({"t": round(current_time, 1), "m": round(mem, 2)})
                        time.sleep(0.005) # Sample every 5ms for high resolution
                    
                    stdout, stderr = process.communicate()
                    end_time = time.perf_counter()
                    
                execution_time = (end_time - start_time) * 1000
                peak_memory = max([s["m"] for s in samples]) if samples else 0

                return {
                    "stdout": stdout,
                    "stderr": stderr,
                    "exit_code": process.returncode,
                    "time": round(execution_time, 2),
                    "memory": round(peak_memory, 2),
                    "samples": samples 
                }
            except Exception as e:
                return {"stdout": "", "stderr": str(e), "exit_code": 1, "time": 0, "memory": 0, "samples": []}
