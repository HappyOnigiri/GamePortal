import re
import sys
from pathlib import Path

# Rules to check
# 1. No explicit 'any' type (e.g., ': any', 'as any')
# 2. No '@ts-ignore' or '@ts-nocheck'
EXPLICIT_ANY_RE = re.compile(r"(:|as)\s+any\b")
TS_IGNORE_RE = re.compile(r"@ts-(ignore|nocheck)")

def check_file(path: Path) -> list[str]:
    errors = []
    try:
        content = path.read_text(encoding="utf-8")
        in_block_comment = False
        for i, line in enumerate(content.splitlines(), 1):
            raw_line = line
            if not in_block_comment:
                idx_slash = line.find("//")
                idx_block = line.find("/*")
                if idx_block != -1 and (idx_slash == -1 or idx_block < idx_slash):
                    in_block_comment = True
                    part_before = line[:idx_block]
                    part_after_start = line[idx_block + 2:]
                    if "*/" in part_after_start:
                        in_block_comment = False
                        part_after = part_after_start.split("*/", 1)[1]
                        line = part_before + part_after
                    else:
                        line = part_before
                if "//" in line:
                    line = line.split("//")[0]
            else:
                if "*/" in line:
                    in_block_comment = False
                    line = line.split("*/", 1)[1]
                    if "//" in line:
                        line = line.split("//")[0]
                else:
                    line = ""
                    
            if EXPLICIT_ANY_RE.search(line):
                errors.append(f"{path}:{i}: Found explicit 'any'")
            if TS_IGNORE_RE.search(raw_line):
                errors.append(f"{path}:{i}: Found @ts-ignore or @ts-nocheck")
    except (OSError, UnicodeDecodeError) as e:
        errors.append(f"{path}: Error reading file: {e}")
    return errors

def is_valid_source(path: Path) -> bool:
    if "node_modules" in str(path) or "_template" in str(path) or ".agent" in str(path):
        return False
    if path.name.endswith((".test.ts", ".test.tsx", ".spec.ts", ".spec.tsx")):
        return False
    return True

def main():
    all_errors = []
    
    # Scan all .ts and .tsx files in subdirectories (excluding node_modules and _template)
    for ext in ["*.ts", "*.tsx"]:
        for path in Path(".").rglob(ext):
            if is_valid_source(path):
                all_errors.extend(check_file(path))

    if all_errors:
        print("\n".join(all_errors))
        print(f"\nTotal errors found: {len(all_errors)}")
        sys.exit(1)
    else:
        print("No TS rule violations found.")
        sys.exit(0)

if __name__ == "__main__":
    main()
