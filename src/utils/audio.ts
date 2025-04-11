import lamejs from "@breezystack/lamejs";
import { createScopedLogger } from "./logger";

const logger = createScopedLogger("audio");

// WebM 转 MP3 转换函数
export async function convertToMp3(webmBlob: Blob): Promise<Blob> {
  try {
    // 将 Blob 转换为 AudioBuffer
    const audioContext = new AudioContext();
    const arrayBuffer = await webmBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // 获取音频数据
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const samples = audioBuffer.getChannelData(0); // 获取第一个声道

    // 创建 MP3 编码器
    const mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128);
    const mp3Data: Int8Array[] = [];

    // 将浮点音频数据转换为 16 位整数
    const sampleBlockSize = 1152; // 必须是 1152 的倍数
    const numSamples = samples.length;

    // 转换音频数据为 Int16Array
    const int16Samples = new Int16Array(samples.length);
    for (let i = 0; i < samples.length; i++) {
      int16Samples[i] = samples[i] * 0x7fff; // 转换为 16 位整数
    }

    // 分块处理音频数据
    for (let i = 0; i < numSamples; i += sampleBlockSize) {
      const sampleChunk = int16Samples.subarray(i, i + sampleBlockSize);
      const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
      if (mp3buf.length > 0) {
        const int8buf = new Int8Array(mp3buf);
        mp3Data.push(int8buf);
      }
    }

    // 完成编码
    const mp3buf = mp3encoder.flush();
    if (mp3buf.length > 0) {
      // Convert Uint8Array to Int8Array before pushing
      const int8buf = new Int8Array(mp3buf);
      mp3Data.push(int8buf);
    }

    // 合并所有 MP3 数据
    const totalLength = mp3Data.reduce((acc, buf) => acc + buf.length, 0);
    const mp3Array = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of mp3Data) {
      mp3Array.set(buf, offset);
      offset += buf.length;
    }

    return new Blob([mp3Array], { type: "audio/mp3" });
  } catch (error) {
    logger.error("Error converting WebM to MP3:", error);
    throw error;
  }
}
