import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import mm


def md_to_blocks(md_text):
    lines = md_text.splitlines()
    blocks = []
    cur = []
    for line in lines:
        if line.strip() == "":
            if cur:
                blocks.append("\n".join(cur))
                cur = []
        else:
            cur.append(line)
    if cur:
        blocks.append("\n".join(cur))
    return blocks


def detect_block_type(block):
    s = block.lstrip()
    if s.startswith('#'):
        # heading level
        hashes = len(s) - len(s.lstrip('#'))
        text = s.lstrip('#').strip()
        return ('heading', hashes, text)
    elif s.startswith('```'):
        return ('code', 0, block)
    else:
        return ('para', 0, block)


def md_to_pdf(md_path, pdf_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        md = f.read()

    blocks = md_to_blocks(md)
    doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                            rightMargin=20*mm, leftMargin=20*mm,
                            topMargin=20*mm, bottomMargin=20*mm)
    styles = getSampleStyleSheet()
    h1 = ParagraphStyle('h1', parent=styles['Heading1'], fontSize=18, spaceAfter=6)
    h2 = ParagraphStyle('h2', parent=styles['Heading2'], fontSize=14, spaceAfter=4)
    body = ParagraphStyle('body', parent=styles['BodyText'], fontSize=10, leading=14)
    code = ParagraphStyle('code', parent=styles['Code'], fontName='Courier', fontSize=8, leading=12)

    flow = []
    for block in blocks:
        kind, lvl, text = detect_block_type(block)
        if kind == 'heading':
            if lvl == 1:
                flow.append(Paragraph(text, h1))
            else:
                flow.append(Paragraph(text, h2))
        elif kind == 'code':
            # keep code block as preformatted text
            cleaned = text.replace('<', '&lt;').replace('>', '&gt;')
            cleaned = cleaned.replace('\n', '<br/>')
            flow.append(Paragraph('<font face="Courier">%s</font>' % cleaned, code))
        else:
            # paragraph: simple markdown cleanup (#, **, ``, etc.)
            p = text.replace('**', '').replace('`', '')
            # convert simple links [text](url) to text (url)
            import re
            p = re.sub(r"\[(.*?)\]\((.*?)\)", r"\1 (\2)", p)
            # convert list markers
            p = re.sub(r"^\s*[-*+]\s+", '• ', p, flags=re.M)
            # replace multiple newlines with <br/>
            p = p.replace('\n', '<br/>')
            flow.append(Paragraph(p, body))
        flow.append(Spacer(1, 6))

    doc.build(flow)


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print('Uso: python md_to_pdf.py <entrada.md> <saida.pdf>')
        sys.exit(1)
    md_to_pdf(sys.argv[1], sys.argv[2])
