// MediaCapabilities Hardware Video Decoding Matrix Probe

import { MediaCapabilitiesResult, CodecSupportItem, EvidenceItem } from "../types";

export async function probeMediaCapabilitiesMatrix(): Promise<MediaCapabilitiesResult> {
  const matrix: CodecSupportItem[] = [];
  const evidence: EvidenceItem[] = [];

  let av1_4k60 = false;
  let hevc_main10_4k60 = false;
  let vp9_p2_4k60 = false;
  let h264_1080p60 = false;
  let hardwareDecoderLikely = false;

  if (typeof navigator === "undefined" || !("mediaCapabilities" in navigator) || !navigator.mediaCapabilities) {
    return {
      matrix,
      av1_4k60: false,
      hevc_main10_4k60: false,
      vp9_p2_4k60: false,
      h264_1080p60: false,
      hardwareDecoderLikely: false,
      evidence,
    };
  }

  const testConfigs = [
    {
      codec: "AV1",
      profile: "Main Profile 4K 60FPS",
      contentType: 'video/mp4; codecs="av01.0.08M.08"',
      width: 3840,
      height: 2160,
      fps: 60,
      bitrate: 25000000,
    },
    {
      codec: "HEVC (H.265)",
      profile: "Main10 Profile 4K 60FPS",
      contentType: 'video/mp4; codecs="hev1.2.4.L153.B0"',
      width: 3840,
      height: 2160,
      fps: 60,
      bitrate: 25000000,
    },
    {
      codec: "VP9",
      profile: "Profile 2 (HDR) 4K 60FPS",
      contentType: 'video/webm; codecs="vp09.02.51.10.01.09.16.09.00"',
      width: 3840,
      height: 2160,
      fps: 60,
      bitrate: 20000000,
    },
    {
      codec: "AVC (H.264)",
      profile: "High Profile 1080p 60FPS",
      contentType: 'video/mp4; codecs="avc1.64002a"',
      width: 1920,
      height: 1080,
      fps: 60,
      bitrate: 10000000,
    },
  ];

  for (const cfg of testConfigs) {
    try {
      const res = await navigator.mediaCapabilities.decodingInfo({
        type: "file",
        video: {
          contentType: cfg.contentType,
          width: cfg.width,
          height: cfg.height,
          framerate: cfg.fps,
          bitrate: cfg.bitrate,
        },
      });

      matrix.push({
        codec: cfg.codec,
        profile: cfg.profile,
        resolution: `${cfg.width}x${cfg.height}`,
        fps: cfg.fps,
        supported: Boolean(res.supported),
        smooth: Boolean(res.smooth),
        powerEfficient: Boolean(res.powerEfficient),
      });

      if (cfg.codec === "AV1" && res.supported && res.powerEfficient) {
        av1_4k60 = true;
        hardwareDecoderLikely = true;
      }
      if (cfg.codec.includes("HEVC") && res.supported && res.powerEfficient) {
        hevc_main10_4k60 = true;
        hardwareDecoderLikely = true;
      }
      if (cfg.codec === "VP9" && res.supported && res.powerEfficient) {
        vp9_p2_4k60 = true;
      }
      if (cfg.codec.includes("AVC") && res.supported) {
        h264_1080p60 = true;
      }
    } catch {
      matrix.push({
        codec: cfg.codec,
        profile: cfg.profile,
        resolution: `${cfg.width}x${cfg.height}`,
        fps: cfg.fps,
        supported: false,
        smooth: false,
        powerEfficient: false,
      });
    }
  }

  if (av1_4k60) {
    evidence.push({
      source: "mediaCapabilities",
      property: "AV1 Hardware Decode",
      value: "4K 60FPS Power-Efficient",
      confidence: 0.9,
      reliability: "strong",
      description: "دیکودر سخت‌افزاری کم‌مصرف AV1 فعال است (معماری NVIDIA RTX 30/40، AMD RX 6000/7000 یا Intel Arc).",
    });
  }

  if (hevc_main10_4k60) {
    evidence.push({
      source: "mediaCapabilities",
      property: "HEVC Main10 Hardware Decode",
      value: "4K 60FPS Power-Efficient",
      confidence: 0.85,
      reliability: "strong",
      description: "پشتیبانی کامل از دیکود ۱۰ بیتی HEVC HDR برای استریم و پخش محتوای باکیفیت.",
    });
  }

  return {
    matrix,
    av1_4k60,
    hevc_main10_4k60,
    vp9_p2_4k60,
    h264_1080p60,
    hardwareDecoderLikely,
    evidence,
  };
}
