"use client";

import { useState } from 'react';

// --- データ定義 ---
const vegetables = {
  tomato: { name: 'トマト', feature: '明るく元気、ムードメーカー', comment: '太陽のように周りを照らすトマト！' },
  goya: { name: 'ゴーヤ', feature: '苦味系、個性派', comment: 'クセのあるあなたはゴーヤタイプ！' },
  carrot: { name: 'ニンジン', feature: '甘くて可愛い、順応性あり', comment: '見た目は可愛いけど中身は芯があるニンジン！' },
  pumpkin: { name: 'カボチャ', feature: '変化球系、ユーモア重視', comment: '面白さ抜群、カボチャタイプ！' },
  broccoli: { name: 'ブロッコリー', feature: '頑張り屋、少し硬派', comment: '健康志向で真面目なブロッコリー！' },
  potato: { name: 'ジャガイモ', feature: '家庭的、安定型', comment: 'どこにいても安心感を与えるジャガイモ！' },
};

const questions = [
  {
    question: "あなたの性格タイプは？",
    answers: [
      { text: "太陽の下で元気に育つ", scores: { tomato: 2 } },
      { text: "地味だけど栄養たっぷり", scores: { broccoli: 2 } },
      { text: "苦味が強い", scores: { goya: 2 } },
      { text: "意外と甘い", scores: { carrot: 2 } },
      { text: "自由気まま", scores: { pumpkin: 2 } },
    ],
  },
  {
    question: "ストレスを感じた時、どうなる？",
    answers: [
      { text: "硬くなる", scores: { broccoli: 1 } },
      { text: "柔らかくなる", scores: { potato: 1 } },
      { text: "刺激に敏感になる", scores: { goya: 1 } }, // 青唐辛子 -> ゴーヤ系
      { text: "放置で腐りかける", scores: { pumpkin: 1 } }, // ナス -> カボチャ系
    ],
  },
  {
    question: "友達からどう思われてる？",
    answers: [
        { text: "明るくムードメーカー", scores: { tomato: 2 } },
        { text: "個性派だね", scores: { goya: 2 } },
        { text: "落ち着きがある", scores: { broccoli: 2 } }, // キャベツ -> ブロッコリー系
        { text: "変化球だね", scores: { pumpkin: 2 } },
        { text: "甘え上手", scores: { carrot: 2 } },
    ],
  },
  {
    question: "好きな季節は？",
    answers: [
        { text: "春", scores: { tomato: 1 } }, // アスパラ -> トマト系
        { text: "夏", scores: { tomato: 1 } },
        { text: "秋", scores: { potato: 1 } }, // サツマイモ -> ジャガイモ系
        { text: "冬", scores: { broccoli: 1 } }, // 白菜 -> ブロッコリー系
    ],
  },
  {
    question: "理想の休日の過ごし方は？",
    answers: [
        { text: "外でアクティブに遊ぶ", scores: { tomato: 1 } }, // キュウリ -> トマト系
        { text: "家でゴロゴロする", scores: { potato: 1 } },
        { text: "新しいことに挑戦する", scores: { goya: 1 } }, // ピーマン -> ゴーヤ系
        { text: "とにかく人を笑わせたい", scores: { pumpkin: 1 } },
    ],
  },
];

type VegetableType = keyof typeof vegetables;

export default function Home() {
  const [step, setStep] = useState('name'); // name, question, result
  const [name, setName] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<VegetableType, number>>({
    tomato: 0, goya: 0, carrot: 0, pumpkin: 0, broccoli: 0, potato: 0
  });
  const [result, setResult] = useState<VegetableType | null>(null);

  const handleNameSubmit = () => {
    if (name.trim()) {
      setStep('question');
    }
  };

  const handleAnswerClick = (answerScores: Partial<Record<VegetableType, number>>) => {
    const newScores = { ...scores };
    for (const veg in answerScores) {
        newScores[veg as VegetableType] += answerScores[veg as VegetableType]!;
    }
    setScores(newScores);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResult(newScores);
      setStep('result');
    }
  };

  const calculateResult = (finalScores: Record<VegetableType, number>) => {
    let maxScore = -1;
    let resultVegs: VegetableType[] = [];
    for (const veg in finalScores) {
      const score = finalScores[veg as VegetableType];
      if (score > maxScore) {
        maxScore = score;
        resultVegs = [veg as VegetableType];
      } else if (score === maxScore) {
        resultVegs.push(veg as VegetableType);
      }
    }
    // 同点の場合はランダムで選択
    const finalResult = resultVegs[Math.floor(Math.random() * resultVegs.length)];
    setResult(finalResult);
  };

  const restart = () => {
    setStep('name');
    setName('');
    setCurrentQuestionIndex(0);
    setScores({ tomato: 0, goya: 0, carrot: 0, pumpkin: 0, broccoli: 0, potato: 0 });
    setResult(null);
  }

  const renderContent = () => {
    switch (step) {
      case 'name':
        return (
          <>
            <h1>あなたを野菜に例えると？</h1>
            <p>ニックネームを入力して診断を始めよう！</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ニックネーム"
            />
            <button className="btn" onClick={handleNameSubmit} disabled={!name.trim()}>診断スタート</button>
          </>
        );
      case 'question':
        const question = questions[currentQuestionIndex];
        return (
          <>
            <h2>Q{currentQuestionIndex + 1}. {question.question}</h2>
            <div>
              {question.answers.map((answer, index) => (
                <button key={index} className="btn question-btn" onClick={() => handleAnswerClick(answer.scores)}>
                  {answer.text}
                </button>
              ))}
            </div>
          </>
        );
      case 'result':
        if (!result) return <p>診断結果を計算中...</p>;
        const vegetable = vegetables[result];
        const shareText = encodeURIComponent(`【診断結果】\n私は「${vegetable.name}」タイプでした！\n${vegetable.comment}\nあなたも診断してみよう！ #自分を野菜に当てはめると`);
        return (
          <>
            <h1>診断結果</h1>
            <div className="result-card">
              <h2>{name}さんは... <strong>{vegetable.name}</strong> タイプ！</h2>
              <p><strong>特徴：</strong>{vegetable.feature}</p>
              <p><strong>一言コメント：</strong>「{vegetable.comment}」</p>
            </div>
            <div className="share-buttons">
                <a href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer" className="btn share-btn">Xでシェア</a>
                {/* 他のSNSボタンは後で追加 */}
            </div>
            <button className="btn" onClick={restart}>もう一度診断する</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <main>
        <div className="container">
            {renderContent()}
        </div>
    </main>
  );
}