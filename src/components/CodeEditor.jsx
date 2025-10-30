import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { Play, X, Clock, CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { cn } from "../lib/utils"

export function CodeEditor({ challenge, onSubmit, onCancel }) {
  const [code, setCode] = useState(challenge.template);
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimit);
  const [showHints, setShowHints] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleSubmit = async () => {
    // Run test cases
    const results = await runTests(code, challenge.testCases);
    setTestResults(results);

    // Calculate accuracy
    const accuracy = (results.passed / results.total) * 100;

    setTimeout(() => {
      onSubmit(code, accuracy, results);
    }, 2000);
  };

  const runTests = async (userCode, testCases) => {
    let passed = 0;
    const results = [];

    try {
      // Create function from user code
      const func = new Function('return ' + userCode)();

      for (const test of testCases) {
        try {
          const result = func(...test.input);
          const isCorrect = JSON.stringify(result) === JSON.stringify(test.expected);
          
          results.push({
            passed: isCorrect,
            input: test.input,
            expected: test.expected,
            actual: result
          });

          if (isCorrect) passed++;
        } catch (error) {
          results.push({
            passed: false,
            input: test.input,
            expected: test.expected,
            error: error.message
          });
        }
      }
    } catch (error) {
      return { passed: 0, total: testCases.length, results: [], error: error.message };
    }

    return { passed, total: testCases.length, results };
  };

  const timePercentage = (timeLeft / challenge.timeLimit) * 100;
  const isLowTime = timeLeft < 10;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-6xl max-h-[90vh] overflow-auto"
        >
          <Card className="p-6 bg-black/60 backdrop-blur-xl border-emerald-500/30">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-amber-400 bg-clip-text text-transparent">
                    CODE CHALLENGE
                  </h2>
                  <Badge variant={challenge.difficulty === 'BEGINNER' ? 'default' : 'secondary'}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-gray-400 text-sm">{challenge.description}</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg border-2',
                  isLowTime ? 'border-red-500/50 bg-red-500/10' : 'border-emerald-500/50 bg-emerald-500/10'
                )}>
                  <Clock className={cn('w-5 h-5', isLowTime ? 'text-red-400' : 'text-emerald-400')} />
                  <span 
                    style={{ fontFamily: 'Orbitron, sans-serif' }} 
                    className={cn('text-2xl font-black', isLowTime ? 'text-red-400' : 'text-emerald-400')}
                  >
                    {timeLeft}s
                  </span>
                </div>

                <Button variant="ghost" size="icon" onClick={onCancel}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Time Progress Bar */}
            <Progress 
              value={timePercentage} 
              className="h-2 mb-6"
              indicatorClassName={isLowTime ? 'bg-red-500' : 'bg-emerald-500'}
            />

            <div className="grid grid-cols-3 gap-6">
              {/* Editor - 2 columns */}
              <div className="col-span-2 space-y-4">
                <div className="rounded-xl overflow-hidden border-2 border-emerald-500/30">
                  <Editor
                    height="500px"
                    defaultLanguage="javascript"
                    value={code}
                    onChange={setCode}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                      fontLigatures: true,
                      lineNumbers: 'on',
                      roundedSelection: true,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      wordWrap: 'on',
                      padding: { top: 16, bottom: 16 }
                    }}
                  />
                </div>

                {/* Submit Button */}
                <Button 
                  onClick={handleSubmit}
                  className="w-full h-14 text-lg font-bold"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  SUBMIT CODE
                </Button>
              </div>

              {/* Right Sidebar - 1 column */}
              <div className="space-y-4">
                {/* Test Cases */}
                <Card className="p-4 bg-black/40 border-white/10">
                  <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    Test Cases
                  </h4>
                  <div className="space-y-2">
                    {challenge.testCases.slice(0, 3).map((test, i) => (
                      <div key={i} className="p-2 rounded-lg bg-white/5 text-xs">
                        <div className="text-gray-400">Input:</div>
                        <code className="text-emerald-400">{JSON.stringify(test.input)}</code>
                        <div className="text-gray-400 mt-1">Expected:</div>
                        <code className="text-amber-400">{JSON.stringify(test.expected)}</code>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Hints */}
                <Card className="p-4 bg-black/40 border-white/10">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="w-full flex items-center justify-between text-sm font-bold text-white mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                      Hints ({challenge.hints?.length || 0})
                    </div>
                    <span className="text-xs text-gray-500">
                      {showHints ? 'Hide' : 'Show'}
                    </span>
                  </button>
                  
                  <AnimatePresence>
                    {showHints && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {challenge.hints?.map((hint, i) => (
                          <div key={i} className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-gray-300">
                            {i + 1}. {hint}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>

                {/* Complexity Info */}
                <Card className="p-4 bg-black/40 border-white/10">
                  <h4 className="text-sm font-bold text-white mb-3">Expected Complexity</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <code className="text-emerald-400">{challenge.timeComplexity || 'N/A'}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Space:</span>
                      <code className="text-blue-400">{challenge.spaceComplexity || 'N/A'}</code>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Test Results Overlay */}
            <AnimatePresence>
              {testResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl border-2"
                  style={{
                    borderColor: testResults.passed === testResults.total ? '#10B981' : '#EF4444',
                    backgroundColor: testResults.passed === testResults.total ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {testResults.passed === testResults.total ? (
                        <>
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          All Tests Passed!
                        </>
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 text-red-400" />
                          Some Tests Failed
                        </>
                      )}
                    </h4>
                    <div style={{ fontFamily: 'Orbitron, sans-serif' }} className="text-2xl font-black">
                      {testResults.passed}/{testResults.total}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {testResults.results?.map((result, i) => (
                      <div key={i} className={cn(
                        'p-2 rounded-lg text-xs',
                        result.passed ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-red-500/20 border border-red-500/30'
                      )}>
                        <div className="font-bold mb-1">Test {i + 1}</div>
                        {result.error ? (
                          <div className="text-red-400">{result.error}</div>
                        ) : (
                          <div className={result.passed ? 'text-emerald-400' : 'text-red-400'}>
                            {result.passed ? '✓ Passed' : '✗ Failed'}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
