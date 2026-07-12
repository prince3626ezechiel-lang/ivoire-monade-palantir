#!/usr/bin/env python3
"""
将HTML内容转换为图片（简化版）
使用 PIL 生成可视化图片
"""

import sys
import textwrap

# 如果有 html2image，可以用它
try:
    import html2image as h2i
    from html2image import Html2Image
    
    hti = Html2Image()
    
    # 读取HTML
    html_file = sys.argv[1] if len(sys.argv) > 1 else "AI-Games-一页纸.html"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "output.png"
    
    # 转换为图片
    hti.screenshot(html_file=html_file, output_file=output_file)
    print(f"✅ 已保存: {output_file}")
    
except ImportError:
    print("html2image not installed")
    print("请运行: pip install html2image")
    sys.exit(1)
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)