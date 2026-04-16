import zipfile
import re
path = 'Final_project_report_format.docx'
if zipfile.is_zipfile(path):
    with zipfile.ZipFile(path) as z:
        if 'word/document.xml' in z.namelist():
            xml = z.read('word/document.xml').decode('utf-8', errors='ignore')
            texts = re.findall(r'<w:t[^>]*>(.*?)</w:t>', xml)
            for t in texts:
                print(re.sub(r'\s+', ' ', t))
        else:
            print('document.xml missing')
else:
    print('not zipfile')
