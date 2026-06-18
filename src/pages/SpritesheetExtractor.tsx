import { useState, useRef, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SpritesheetExtractor = () => {
  const [spritesheet, setSpritesheet] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [sprites, setSprites] = useState([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const canvasRef = useRef(null);

  const handleSpritesheetUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSpritesheet(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setJsonData(data);
        } catch (error) {
          alert('JSON文件格式错误');
        }
      };
      reader.readAsText(file);
    }
  };

  const extractSprites = useCallback(() => {
    if (!spritesheet || !jsonData) {
      alert('请先上传精灵图和JSON配置文件');
      return;
    }

    setIsExtracting(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const extractedSprites = [];
      const frames = jsonData.frames || jsonData;

      for (const [name, frameData] of Object.entries(frames)) {
        let frame;
        if (frameData.frame) {
          frame = frameData.frame;
        } else if (typeof frameData.x === 'number') {
          frame = { x: frameData.x, y: frameData.y, w: frameData.width || frameData.w, h: frameData.height || frameData.h };
        } else {
          continue;
        }

        const spriteCanvas = document.createElement('canvas');
        spriteCanvas.width = frame.w;
        spriteCanvas.height = frame.h;
        const spriteCtx = spriteCanvas.getContext('2d');

        spriteCtx.drawImage(
          canvas,
          frame.x,
          frame.y,
          frame.w,
          frame.h,
          0,
          0,
          frame.w,
          frame.h
        );

        extractedSprites.push({
          name: name.replace('.png', '').replace('.jpg', ''),
          canvas: spriteCanvas
        });
      }

      setSprites(extractedSprites);
      setIsExtracting(false);
    };

    img.src = spritesheet;
  }, [spritesheet, jsonData]);

  const downloadAll = async () => {
    if (sprites.length === 0) return;

    const zip = new JSZip();

    sprites.forEach((sprite) => {
      const dataUrl = sprite.canvas.toDataURL('image/png');
      const base64Data = dataUrl.split(',')[1];
      zip.file(`${sprite.name}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'extracted-sprites.zip');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">精灵图拆解器</h1>
          <p className="text-gray-400">上传精灵图和JSON配置文件，将每个元素单独切割并下载</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <label className="block text-white font-medium mb-3">上传精灵图 (PNG/JPG)</label>
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={handleSpritesheetUpload}
                className="hidden"
                id="spritesheet-upload"
              />
              <label htmlFor="spritesheet-upload" className="cursor-pointer">
                {spritesheet ? (
                  <img src={spritesheet} alt="精灵图预览" className="max-h-40 mx-auto rounded-lg" />
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>点击或拖拽上传</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <label className="block text-white font-medium mb-3">上传JSON配置文件</label>
            <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleJsonUpload}
                className="hidden"
                id="json-upload"
              />
              <label htmlFor="json-upload" className="cursor-pointer">
                {jsonData ? (
                  <div className="text-green-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>JSON文件已加载</p>
                  </div>
                ) : (
                  <div className="text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <p>点击或拖拽上传</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={extractSprites}
            disabled={isExtracting}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isExtracting ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在拆解...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                开始拆解
              </>
            )}
          </button>

          <button
            onClick={downloadAll}
            disabled={sprites.length === 0}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载全部 ({sprites.length})
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {sprites.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">拆解结果预览</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {sprites.map((sprite, index) => (
                <div key={index} className="bg-slate-900/50 rounded-lg p-3">
                  <img
                    src={sprite.canvas.toDataURL()}
                    alt={sprite.name}
                    className="w-full h-auto rounded mb-2"
                  />
                  <p className="text-xs text-gray-400 truncate text-center">{sprite.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-3">使用说明</h3>
          <ul className="text-gray-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-purple-400">1.</span>
              <span>上传精灵图（支持PNG/JPG格式）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">2.</span>
              <span>上传对应的JSON配置文件（包含每个精灵的位置信息）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">3.</span>
              <span>点击「开始拆解」按钮，系统会自动切割每个精灵</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400">4.</span>
              <span>点击「下载全部」将所有拆解的图片打包成ZIP文件下载</span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-gray-400">
              <span className="text-purple-400 font-medium">支持的JSON格式：</span>
              支持TexturePacker和类似工具导出的JSON格式，包含frames对象，每个frame包含x、y、width/height或w、h属性。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpritesheetExtractor;