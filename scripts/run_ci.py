#!/usr/bin/env python3
import subprocess
import sys
import concurrent.futures
import time

def run_task(name, command):
    """
    指定されたコマンドを実行し、成功・失敗と出力を返す。
    :param name: タスク名
    :param command: 実行するコマンド（リスト形式）
    :return: (is_success, name, output, duration)
    """
    start_time = time.time()
    try:
        # 出力をキャプチャして実行
        result = subprocess.run(
            command,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True
        )
        duration = time.time() - start_time
        return True, name, result.stdout, duration
    except subprocess.CalledProcessError as e:
        duration = time.time() - start_time
        return False, name, e.stdout, duration

def execute_phase(phase_name, tasks):
    """
    タスクのリストを並列実行する。
    :param phase_name: フェーズ名（ログ用）
    :param tasks: (name, command) のタプルのリスト
    :return: 成功したかどうか (bool)
    """
    if phase_name:
        print(f"--- {phase_name} ---")
        
    if not tasks:
        print(f"Skipping {phase_name}: No tasks to run.")
        return True
    
    failed = False
    failure_details = []

    # 並列数はタスク数に応じて自動調整される
    with concurrent.futures.ThreadPoolExecutor(max_workers=len(tasks)) as executor:
        future_to_name = {
            executor.submit(run_task, name, cmd): name
            for name, cmd in tasks
        }

        for future in concurrent.futures.as_completed(future_to_name):
            success, name, output, duration = future.result()
            if success:
                print(f"✅ {name} ({duration:.2f}s)")
            else:
                print(f"❌ {name} ({duration:.2f}s)")
                failed = True
                failure_details.append((name, output))
    
    if failed:
        print("\n=== FAILURE DETAILS ===")
        for name, output in failure_details:
            print(f"--- {name} Output ---")
            safe_output = output or ""
            print(safe_output.strip())
            print("-----------------------")
        return False
    
    return True

def main():
    # Phase 1: Fix (修正タスク)
    fix_tasks = [
        ("TS Fix", ["make", "ts-fix-diff"]),
        ("HTML Fix", ["make", "html-fix-diff"]),
    ]
    
    # fix phase はエラーなしで続行
    execute_phase("Auto Fix Phase", fix_tasks)

    # Phase 2: Check (検証タスク)
    check_tasks = [
        ("TS Check", ["make", "ts-check-diff"]),
        ("HTML Check", ["make", "html-check-diff"]),
        ("Type Check", ["make", "check-ts"]),
        ("Custom Rules", ["make", "check-ts-rules"]),
    ]

    if not execute_phase("Check Phase", check_tasks):
        print("Check phase failed.")
        sys.exit(1)

    print("\n🎉 All CI tasks passed!")

if __name__ == "__main__":
    main()
