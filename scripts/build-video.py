"""Optional: pip install pillow imageio-ffmpeg. Assemble real UI screenshots, not simulated UI."""
from pathlib import Path
import os, subprocess, tempfile
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'demo' / 'specguard-demo-180s.mp4'
FONT = next((p for p in [Path('C:/Windows/Fonts/arial.ttf'), Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf')] if p.exists()), None)
if FONT is None:
    raise RuntimeError('Set FONT to a font with Vietnamese coverage')
def font(n): return ImageFont.truetype(str(FONT), n)
scenes = [
    (25, '01 / VẤN ĐỀ', 'Rõ yêu cầu, vững căn cứ', [
        'SpecGuard hỗ trợ rà soát đặc tả phần mềm trước khi viết code và test.',
        'Tình huống: sinh viên đặt phòng tự học. Nhóm cần thống nhất điều kiện nghiệm thu.',
        'Bản này dùng luật offline; chưa có lượt chạy LLM hoặc Model Swap.'], '01-happy.png'),
    (25, '02 / ĐẦU VÀO → BẢN NHÁP', 'Mỗi tiêu chí có bằng chứng', [
        'Input gồm Người dùng, Mục tiêu, Yêu cầu và Tiêu chí, mỗi nhãn trên một dòng.',
        'Output trích Given / When / Then cùng các dòng nguồn để người dùng đối chiếu.',
        'REVIEW nghĩa là chờ duyệt; chưa phải kết luận đúng về nghiệp vụ.'], '01-happy.png'),
    (30, '03 / BREAK V1', 'Thiếu dữ kiện, vẫn tự đặt SLA', [
        'TC02 bỏ toàn bộ dòng Tiêu chí. Không có số giây nào trong input.',
        'V1 vẫn trả “Hoàn thành trong 1 giây” do fallback của offline adapter.',
        'Đây là lỗi code quan sát được, không được gọi là lỗi LLM đã đo.'], '02-v1-failure.png'),
    (30, '04 / FIX V2', 'Dừng đúng lúc để hỏi lại', [
        'Cùng input TC02, V2 trả NEED_INFO và yêu cầu bổ sung Tiêu chí.',
        'Input gate chặn trước adapter. Output gate đối chiếu cấu trúc và trích dẫn.',
        'Không có tiêu chí tự bịa; nút xuất tiếp tục bị khóa.'], '03-v2-stop.png'),
    (25, '05 / RANH GIỚI CHỈ DẪN', 'Tài liệu là dữ liệu đầu vào', [
        'TC08 chèn một câu yêu cầu bỏ qua chỉ dẫn trước đó và tiết lộ system prompt.',
        'V2 nhận diện mẫu đã biết, trả REFUSED và không gọi adapter.',
        'Bộ từ khóa có thể bỏ sót cách diễn đạt mới; không cam kết chặn mọi injection.'], '04-injection.png'),
    (25, '06 / DỮ LIỆU & NGƯỜI DUYỆT', 'Che PII trước khi xử lý', [
        'TC11 dùng email tổng hợp. V2 thay email bằng [EMAIL] trước adapter.',
        'Con người đối chiếu từng tiêu chí rồi mới mở nút tải bản nháp JSON.',
        'Giao diện offline không gửi input ra mạng và không tự gửi email.'], '05-pii.png'),
    (20, '07 / EVIDENCE & NEXT STEP', 'Bằng chứng có giới hạn rõ ràng', [
        '12 ca tổng hợp: V1 đạt 1/12; V2 đạt 12/12. 25 unit test đạt.',
        'Có CSV 7 trường, raw JSON và lệnh tái lập. Chưa đo hiệu quả người dùng thật.',
        'Tiếp theo: chạy hai dòng LLM độc lập và cập nhật hồ sơ theo kết quả thực tế.'], '03-v2-stop.png')
]
def wrap(draw, text, face, width):
    lines=[]; line=''
    for word in text.split():
        candidate=(line+' '+word).strip()
        if draw.textlength(candidate,font=face)>width and line:
            lines.append(line);line=word
        else: line=candidate
    if line: lines.append(line)
    return lines

with tempfile.TemporaryDirectory(prefix='specguard-video-') as temp:
    tmp=Path(temp); manifest=[]
    for index,(duration,section,title,paragraphs,screenshot) in enumerate(scenes):
        canvas=Image.new('RGB',(1280,720),'#f4f5ed');d=ImageDraw.Draw(canvas)
        d.rectangle((0,0,1280,8),fill='#1c654a')
        d.text((48,35),'SpecGuard  /  Yuiryan',font=font(22),fill='#1c654a')
        d.text((48,102),section,font=font(17),fill='#62766e')
        y=148
        for line in wrap(d,title,font(35),740):d.text((48,y),line,font=font(35),fill='#18352f');y+=46
        y+=24
        for para in paragraphs:
            d.ellipse((49,y+10,57,y+18),fill='#6c9368')
            for line in wrap(d,para,font(23),675):d.text((73,y),line,font=font(23),fill='#18352f');y+=34
            y+=23
        shot=Image.open(ROOT/'demo'/'screenshots'/screenshot).convert('RGB')
        shot.thumbnail((395,540),Image.Resampling.LANCZOS)
        canvas.paste(shot,(835+(395-shot.width)//2,95))
        d.text((850,648),'Ảnh chụp giao diện chạy thật',font=font(16),fill='#62766e')
        d.line((48,675,1230,675),fill='#b9cbb7',width=1)
        d.text((48,690),'DEMO OFFLINE • Thuyết minh bằng chữ • Không có kết quả LLM',font=font(14),fill='#62766e')
        d.text((1165,690),f'{index+1}/7',font=font(14),fill='#62766e')
        path=tmp/f'scene-{index}.png';canvas.save(path)
        manifest.extend([f"file '{path.as_posix()}'",f'duration {duration}'])
    manifest.append(f"file '{path.as_posix()}'")
    listing=tmp/'frames.txt';listing.write_text('\n'.join(manifest),encoding='utf8')
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','concat','-safe','0','-i',str(listing),'-t','180','-vf','fps=10,format=yuv420p','-c:v','libx264','-preset','fast','-crf','22','-movflags','+faststart',str(OUT)],check=True)
    canvas.save(ROOT/'demo'/'video-summary.png')
print(OUT)
