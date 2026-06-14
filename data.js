window.WORLD_CUP_DATA = {
  "meta": {
    "schemaVersion": 3,
    "lastUpdated": "2026-06-14 19:28",
    "timezone": "Asia/Shanghai",
    "updateMode": "auto",
    "currentDayKey": "today",
    "source": "自动生成：本地赛程与比分数据",
    "note": "data.js 由 scripts/update-data.mjs 生成；以后只需要更新数据源或接入外部接口。"
  },
  "dayOrder": [
    "yesterday",
    "today",
    "tomorrow"
  ],
  "days": {
    "yesterday": {
      "label": "昨天",
      "date": "6月13日",
      "isoDate": "2026-06-13",
      "summary": "昨天 4 场预测中，已复盘 3 场，命中 2 场，还有 1 场待复盘。",
      "predictions": [
        {
          "id": "pred-20260613-ger-kor",
          "matchId": "match-20260613-ger-kor",
          "time": "18:00",
          "match": "德国 vs 韩国",
          "phase": "小组赛 A 组",
          "pick": "德国胜",
          "score": "2-1",
          "confidence": "高",
          "bucket": "high",
          "reason": "德国中前场压制力更强",
          "source": "seed"
        },
        {
          "id": "pred-20260613-eng-usa",
          "matchId": "match-20260613-eng-usa",
          "time": "21:00",
          "match": "英格兰 vs 美国",
          "phase": "小组赛 B 组",
          "pick": "英格兰胜",
          "score": "1-0",
          "confidence": "中",
          "bucket": "mid",
          "reason": "英格兰控球更稳，但破密防不轻松",
          "source": "seed"
        },
        {
          "id": "pred-20260614-por-sui",
          "matchId": "match-20260614-por-sui",
          "time": "00:00",
          "match": "葡萄牙 vs 瑞士",
          "phase": "小组赛 C 组",
          "pick": "葡萄牙胜",
          "score": "2-0",
          "confidence": "高",
          "bucket": "high late",
          "reason": "葡萄牙边路推进优势明显",
          "source": "seed"
        },
        {
          "id": "pred-20260614-ned-gha",
          "matchId": "match-20260614-ned-gha",
          "time": "03:00",
          "match": "荷兰 vs 加纳",
          "phase": "小组赛 D 组",
          "pick": "荷兰胜",
          "score": "2-1",
          "confidence": "低",
          "bucket": "low late",
          "reason": "荷兰整体更强，但加纳反击有威胁",
          "source": "seed"
        }
      ],
      "reviews": [
        {
          "id": "review-20260613-ger-kor",
          "predictionId": "pred-20260613-ger-kor",
          "matchId": "match-20260613-ger-kor",
          "match": "德国 vs 韩国",
          "predict": "德国胜 2-1",
          "actual": "2-0",
          "actualScore": "2-0",
          "status": "hit",
          "exact": false,
          "note": "方向命中，比分仍有偏差"
        },
        {
          "id": "review-20260613-eng-usa",
          "predictionId": "pred-20260613-eng-usa",
          "matchId": "match-20260613-eng-usa",
          "match": "英格兰 vs 美国",
          "predict": "英格兰胜 1-0",
          "actual": "1-1",
          "actualScore": "1-1",
          "status": "miss",
          "exact": false,
          "note": "方向未命中，需要复盘球队状态和临场变化"
        },
        {
          "id": "review-20260614-por-sui",
          "predictionId": "pred-20260614-por-sui",
          "matchId": "match-20260614-por-sui",
          "match": "葡萄牙 vs 瑞士",
          "predict": "葡萄牙胜 2-0",
          "actual": "2-0",
          "actualScore": "2-0",
          "status": "hit",
          "exact": true,
          "note": "方向和比分均精准"
        },
        {
          "id": "review-20260614-ned-gha",
          "predictionId": "pred-20260614-ned-gha",
          "matchId": "match-20260614-ned-gha",
          "match": "荷兰 vs 加纳",
          "predict": "荷兰胜 2-1",
          "actual": "待开奖",
          "actualScore": null,
          "status": "pending",
          "exact": false,
          "note": "比赛未结束，暂不计入命中率"
        }
      ]
    },
    "today": {
      "label": "今天",
      "date": "6月14日",
      "isoDate": "2026-06-14",
      "summary": "今天的比赛还在进行或等待开赛，复盘结果先标为待复盘。",
      "predictions": [
        {
          "id": "pred-20260614-arg-den",
          "matchId": "match-20260614-arg-den",
          "time": "18:00",
          "match": "阿根廷 vs 丹麦",
          "phase": "小组赛 C 组",
          "pick": "阿根廷胜",
          "score": "2-0",
          "confidence": "高",
          "bucket": "high",
          "reason": "控球和前场效率更稳定",
          "source": "seed"
        },
        {
          "id": "pred-20260614-fra-jpn",
          "matchId": "match-20260614-fra-jpn",
          "time": "21:00",
          "match": "法国 vs 日本",
          "phase": "小组赛 D 组",
          "pick": "法国胜",
          "score": "2-1",
          "confidence": "中",
          "bucket": "mid",
          "reason": "法国个人能力占优，但防线有波动",
          "source": "seed"
        },
        {
          "id": "pred-20260615-bra-mar",
          "matchId": "match-20260615-bra-mar",
          "time": "00:00",
          "match": "巴西 vs 摩洛哥",
          "phase": "小组赛 E 组",
          "pick": "巴西胜",
          "score": "1-0",
          "confidence": "高",
          "bucket": "high late",
          "reason": "巴西阵地战更强，进球数可能偏低",
          "source": "seed"
        },
        {
          "id": "pred-20260615-esp-uru",
          "matchId": "match-20260615-esp-uru",
          "time": "03:00",
          "match": "西班牙 vs 乌拉圭",
          "phase": "小组赛 F 组",
          "pick": "平局",
          "score": "1-1",
          "confidence": "低",
          "bucket": "low late",
          "reason": "两队节奏差异大，不确定性较高",
          "source": "seed"
        }
      ],
      "reviews": [
        {
          "id": "review-20260614-arg-den",
          "predictionId": "pred-20260614-arg-den",
          "matchId": "match-20260614-arg-den",
          "match": "阿根廷 vs 丹麦",
          "predict": "阿根廷胜 2-0",
          "actual": "待开奖",
          "actualScore": null,
          "status": "pending",
          "exact": false,
          "note": "比赛未结束，暂不计入命中率"
        },
        {
          "id": "review-20260614-fra-jpn",
          "predictionId": "pred-20260614-fra-jpn",
          "matchId": "match-20260614-fra-jpn",
          "match": "法国 vs 日本",
          "predict": "法国胜 2-1",
          "actual": "待开奖",
          "actualScore": null,
          "status": "pending",
          "exact": false,
          "note": "比赛未结束，暂不计入命中率"
        },
        {
          "id": "review-20260615-bra-mar",
          "predictionId": "pred-20260615-bra-mar",
          "matchId": "match-20260615-bra-mar",
          "match": "巴西 vs 摩洛哥",
          "predict": "巴西胜 1-0",
          "actual": "待开奖",
          "actualScore": null,
          "status": "pending",
          "exact": false,
          "note": "比赛未结束，暂不计入命中率"
        },
        {
          "id": "review-20260615-esp-uru",
          "predictionId": "pred-20260615-esp-uru",
          "matchId": "match-20260615-esp-uru",
          "match": "西班牙 vs 乌拉圭",
          "predict": "平局 1-1",
          "actual": "待开奖",
          "actualScore": null,
          "status": "pending",
          "exact": false,
          "note": "比赛未结束，暂不计入命中率"
        }
      ]
    },
    "tomorrow": {
      "label": "明天",
      "date": "6月15日",
      "isoDate": "2026-06-15",
      "summary": "明天有 3 场赛前预测，比赛结束后会自动进入复盘。",
      "predictions": [
        {
          "id": "pred-20260615-ita-sen",
          "matchId": "match-20260615-ita-sen",
          "time": "18:00",
          "match": "意大利 vs 塞内加尔",
          "phase": "小组赛 G 组",
          "pick": "意大利胜",
          "score": "1-0",
          "confidence": "中",
          "bucket": "mid",
          "reason": "意大利防守组织更完整",
          "source": "seed"
        },
        {
          "id": "pred-20260615-bel-mex",
          "matchId": "match-20260615-bel-mex",
          "time": "21:00",
          "match": "比利时 vs 墨西哥",
          "phase": "小组赛 H 组",
          "pick": "平局",
          "score": "1-1",
          "confidence": "低",
          "bucket": "low",
          "reason": "两队都有前场能力，走势容易拉锯",
          "source": "seed"
        },
        {
          "id": "pred-20260616-cro-can",
          "matchId": "match-20260616-cro-can",
          "time": "00:00",
          "match": "克罗地亚 vs 加拿大",
          "phase": "小组赛 A 组",
          "pick": "克罗地亚胜",
          "score": "2-1",
          "confidence": "高",
          "bucket": "high late",
          "reason": "克罗地亚中场经验优势明显",
          "source": "seed"
        }
      ],
      "reviews": []
    }
  },
  "schedule": [
    {
      "id": "match-20260613-ger-kor",
      "isoDate": "2026-06-13",
      "coverageDate": "2026-06-13",
      "date": "6月13日",
      "stage": "小组赛",
      "home": "德国",
      "away": "韩国",
      "match": "德国 vs 韩国",
      "kick": "18:00",
      "state": "已完赛",
      "actualScore": "2-0"
    },
    {
      "id": "match-20260613-eng-usa",
      "isoDate": "2026-06-13",
      "coverageDate": "2026-06-13",
      "date": "6月13日",
      "stage": "小组赛",
      "home": "英格兰",
      "away": "美国",
      "match": "英格兰 vs 美国",
      "kick": "21:00",
      "state": "已完赛",
      "actualScore": "1-1"
    },
    {
      "id": "match-20260614-por-sui",
      "isoDate": "2026-06-14",
      "coverageDate": "2026-06-13",
      "date": "6月14日",
      "stage": "小组赛",
      "home": "葡萄牙",
      "away": "瑞士",
      "match": "葡萄牙 vs 瑞士",
      "kick": "00:00",
      "state": "已完赛",
      "actualScore": "2-0"
    },
    {
      "id": "match-20260614-ned-gha",
      "isoDate": "2026-06-14",
      "coverageDate": "2026-06-13",
      "date": "6月14日",
      "stage": "小组赛",
      "home": "荷兰",
      "away": "加纳",
      "match": "荷兰 vs 加纳",
      "kick": "03:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260614-arg-den",
      "isoDate": "2026-06-14",
      "coverageDate": "2026-06-14",
      "date": "6月14日",
      "stage": "小组赛",
      "home": "阿根廷",
      "away": "丹麦",
      "match": "阿根廷 vs 丹麦",
      "kick": "18:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260614-fra-jpn",
      "isoDate": "2026-06-14",
      "coverageDate": "2026-06-14",
      "date": "6月14日",
      "stage": "小组赛",
      "home": "法国",
      "away": "日本",
      "match": "法国 vs 日本",
      "kick": "21:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260615-bra-mar",
      "isoDate": "2026-06-15",
      "coverageDate": "2026-06-14",
      "date": "6月15日",
      "stage": "小组赛",
      "home": "巴西",
      "away": "摩洛哥",
      "match": "巴西 vs 摩洛哥",
      "kick": "00:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260615-esp-uru",
      "isoDate": "2026-06-15",
      "coverageDate": "2026-06-14",
      "date": "6月15日",
      "stage": "小组赛",
      "home": "西班牙",
      "away": "乌拉圭",
      "match": "西班牙 vs 乌拉圭",
      "kick": "03:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260615-ita-sen",
      "isoDate": "2026-06-15",
      "coverageDate": "2026-06-15",
      "date": "6月15日",
      "stage": "小组赛",
      "home": "意大利",
      "away": "塞内加尔",
      "match": "意大利 vs 塞内加尔",
      "kick": "18:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260615-bel-mex",
      "isoDate": "2026-06-15",
      "coverageDate": "2026-06-15",
      "date": "6月15日",
      "stage": "小组赛",
      "home": "比利时",
      "away": "墨西哥",
      "match": "比利时 vs 墨西哥",
      "kick": "21:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260616-cro-can",
      "isoDate": "2026-06-16",
      "coverageDate": "2026-06-15",
      "date": "6月16日",
      "stage": "小组赛",
      "home": "克罗地亚",
      "away": "加拿大",
      "match": "克罗地亚 vs 加拿大",
      "kick": "00:00",
      "state": "未开赛",
      "actualScore": null
    },
    {
      "id": "match-20260627-a1-b2",
      "isoDate": "2026-06-27",
      "coverageDate": "2026-06-27",
      "date": "6月27日",
      "stage": "淘汰赛",
      "home": "A1",
      "away": "B2",
      "match": "A1 vs B2",
      "kick": "22:00",
      "state": "待定",
      "actualScore": null
    },
    {
      "id": "match-20260628-c1-d2",
      "isoDate": "2026-06-28",
      "coverageDate": "2026-06-27",
      "date": "6月28日",
      "stage": "淘汰赛",
      "home": "C1",
      "away": "D2",
      "match": "C1 vs D2",
      "kick": "02:00",
      "state": "待定",
      "actualScore": null
    }
  ]
};
