
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { TextDisplay }  from './components/TextDisplay';
import { InputArea } from './components/InputArea';
import { StatsDisplay } from './components/StatsDisplay';
import { ControlButton } from './components/ControlButton';
import { SAMPLE_PASSAGES } from './constants';
import { TestStatus } from './types';
import { FaRedo, FaPlay } from 'react-icons/fa';

const App: React.FC = () => {
  const [passage, setPassage] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [testStatus, setTestStatus] = useState<TestStatus>(TestStatus.Idle);

  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [errors, setErrors] = useState<number>(0);
  const [correctChars, setCorrectChars] = useState<number>(0);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectNewPassage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SAMPLE_PASSAGES.length);
    setPassage(SAMPLE_PASSAGES[randomIndex]);
  }, []);

  useEffect(() => {
    if (testStatus === TestStatus.Idle) {
      selectNewPassage();
    }
  }, [testStatus, selectNewPassage]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (testStatus === TestStatus.Running && startTime) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      clearInterval(intervalId);
    }
    return () => clearInterval(intervalId);
  }, [testStatus, startTime]);

  useEffect(() => {
    if (testStatus === TestStatus.Running && elapsedTime > 0 && correctChars > 0) {
      const minutes = elapsedTime / 60;
      setCpm(Math.round(correctChars / minutes));
      setWpm(Math.round((correctChars / 5) / minutes)); // Standard word is 5 chars
    } else if (testStatus !== TestStatus.Running && correctChars === 0) {
        setCpm(0);
        setWpm(0);
    }
  }, [elapsedTime, correctChars, testStatus]);

  const startTest = useCallback(() => {
    selectNewPassage();
    setTypedText('');
    setStartTime(Date.now());
    setElapsedTime(0);
    setWpm(0);
    setCpm(0);
    setAccuracy(0);
    setErrors(0);
    setCorrectChars(0);
    setTestStatus(TestStatus.Running);
    inputRef.current?.focus();
  }, [selectNewPassage]);

  const finishTest = useCallback((finalCorrectChars: number, finalTypedChars: number) => {
    setTestStatus(TestStatus.Finished);
    if (elapsedTime > 0 && finalCorrectChars > 0) {
      const minutes = elapsedTime / 60;
      setCpm(Math.round(finalCorrectChars / minutes));
      setWpm(Math.round((finalCorrectChars / 5) / minutes));
      setAccuracy(Math.round((finalCorrectChars / finalTypedChars) * 100));
    } else {
      setCpm(0);
      setWpm(0);
      setAccuracy(finalTypedChars > 0 ? Math.round((finalCorrectChars / finalTypedChars) * 100) : 0);
    }
  }, [elapsedTime]);


  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (testStatus !== TestStatus.Running) return;

    const newTypedText = e.target.value;
    setTypedText(newTypedText);

    let currentCorrect = 0;
    let currentErrors = 0;
    const minLength = Math.min(newTypedText.length, passage.length);

    for (let i = 0; i < minLength; i++) {
      if (newTypedText[i] === passage[i]) {
        currentCorrect++;
      } else {
        currentErrors++;
      }
    }
    // Errors also include characters typed beyond passage length
    if (newTypedText.length > passage.length) {
        currentErrors += (newTypedText.length - passage.length);
    }


    setCorrectChars(currentCorrect);
    setErrors(currentErrors);

    if (newTypedText.length > 0) {
      setAccuracy(Math.round((currentCorrect / newTypedText.length) * 100));
    } else {
      setAccuracy(0);
    }

    if (newTypedText.length >= passage.length && testStatus === TestStatus.Running) {
      finishTest(currentCorrect, newTypedText.length);
    }
  }, [testStatus, passage, finishTest]);

  const restartTest = useCallback(() => {
    startTest();
  }, [startTest]);
  
  useEffect(() => {
    if (testStatus === TestStatus.Running) {
      inputRef.current?.focus();
    }
  }, [testStatus]);

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center p-4 selection:bg-brand-primary selection:text-dark-bg">
      <Header />
      <main className="w-full max-w-4xl mt-8 flex flex-col gap-8">
        <StatsDisplay
          wpm={wpm}
          cpm={cpm}
          accuracy={accuracy}
          errors={errors}
          time={elapsedTime}
        />
        <div className="bg-dark-card p-6 rounded-xl shadow-2xl relative">
           {testStatus === TestStatus.Idle && (
             <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10 rounded-xl">
                <h2 className="text-3xl font-orbitron text-brand-primary mb-4">Ready to Type?</h2>
                <ControlButton onClick={startTest} icon={<FaPlay className="mr-2"/>}>
                    Start Test
                </ControlButton>
             </div>
           )}
           {testStatus === TestStatus.Finished && (
             <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center z-10 rounded-xl">
                <h2 className="text-3xl font-orbitron text-brand-primary mb-2">Test Complete!</h2>
                <p className="text-xl text-text-light mb-4">WPM: {wpm} | Accuracy: {accuracy}%</p>
                <ControlButton onClick={restartTest} icon={<FaRedo className="mr-2"/>}>
                    Try Again
                </ControlButton>
             </div>
           )}
          <TextDisplay passage={passage} typedText={typedText} status={testStatus} />
        </div>
        <InputArea
          ref={inputRef}
          value={typedText}
          onChange={handleInputChange}
          disabled={testStatus !== TestStatus.Running}
          passageLength={passage.length}
        />
        <div className="flex justify-center gap-4">
          {testStatus === TestStatus.Running && (
            <ControlButton onClick={restartTest} variant="secondary" icon={<FaRedo className="mr-2"/>}>
              Restart
            </ControlButton>
          )}
        </div>
      </main>
      <footer className="mt-auto py-6 text-center text-text-dim">
        <p>&copy; {new Date().getFullYear()} WXP Typing Master. Unleash your typing potential.</p>
      </footer>
    </div>
  );
};

export default App;
