
import sys

file_path = r'd:\newyogaproject\newyogaproject\style.css'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if '.btn-icon {' in line:
        new_lines.append(line)
        # We assume the next lines are the ones we want to change
        continue
    if 'background: rgba(255, 255, 255, 0.08);' in line: # I already changed this
        new_lines.append(line)
        continue
    if 'border: none;' in line:
        new_lines.append('  border: 1px solid rgba(255, 255, 255, 0.1);\n')
        continue
    if 'width: 40px;' in line:
        new_lines.append('  width: 42px;\n')
        continue
    if 'height: 40px;' in line:
        new_lines.append('  height: 42px;\n')
        continue
    if 'border-radius: 50%;' in line:
        new_lines.append('  border-radius: 12px;\n')
        continue
    if 'transform: scale(1.1);' in line:
        new_lines.append('  transform: translateY(-2px);\n')
        continue
    if 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);' in line:
        new_lines.append('  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);\n')
        continue
    new_lines.append(line)

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
