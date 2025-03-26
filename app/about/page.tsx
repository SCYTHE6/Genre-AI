import Navbar from '../components/Navbar';
import styles from './about.module.css';
import Image from 'next/image';

export default function About() {
  return (
    <div>
      <header className="text-center mb-12">
        <h1 className="section-title">About Audio Genre Transformer</h1>
        <p className="section-description">
          Discover how our advanced AI technology transforms your music into different genres
        </p>
      </header>

      {/* Hero Section */}
      <div className="card mb-12 overflow-hidden">
        <div className="relative h-60 md:h-80 w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-600 opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powered by AI</h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                Our technology uses advanced machine learning to analyze and transform audio into authentic genre styles
              </p>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-value">4+</div>
              <div className="stat-label">Supported Genres</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">99%</div>
              <div className="stat-label">Preservation Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">10s</div>
              <div className="stat-label">Average Process Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 gradient-text">How It Works</h2>
        <div className="timeline">
          <div className="timeline-item left">
            <div className="timeline-content">
              <h3 className="text-xl font-semibold mb-2">Upload Your Audio</h3>
              <p>Start by uploading an audio file in MP3 or WAV format. Our system works best with clear recordings.</p>
            </div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-content">
              <h3 className="text-xl font-semibold mb-2">Select Target Genre</h3>
              <p>Choose which genre you want your audio transformed into. We currently support Rock, Jazz, Electronic, and Classical genres.</p>
            </div>
          </div>
          <div className="timeline-item left">
            <div className="timeline-content">
              <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
              <p>Our advanced machine learning models analyze your audio, separating different elements and understanding its musical characteristics.</p>
            </div>
          </div>
          <div className="timeline-item right">
            <div className="timeline-content">
              <h3 className="text-xl font-semibold mb-2">Genre Transformation</h3>
              <p>The system applies genre-specific effects, adjusting elements like timbre, rhythm, instrumentation, and dynamics.</p>
            </div>
          </div>
          <div className="timeline-item left">
            <div className="timeline-content">
              <h3 className="text-xl font-semibold mb-2">Download Result</h3>
              <p>Once processing is complete, you can preview and download your transformed audio file with the new genre characteristics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Our Technology</h2>
        <div className="card">
          <div className="card-body">
            <p className="mb-6">
              Audio Genre Transformer combines several state-of-the-art technologies to deliver high-quality genre transformations:
            </p>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3>Source Separation</h3>
                <p>Our AI isolates vocals, drums, bass, and other instruments from the original audio for precise transformation.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3>Neural Networks</h3>
                <p>Deep learning models trained on thousands of genre-specific music samples enable authentic transformations.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3>DSP Effects</h3>
                <p>Custom digital signal processing applies genre-authentic sound effects to each isolated component.</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Technologies We Use</h3>
              <div className="flex flex-wrap">
                <span className="tech-badge">TensorFlow</span>
                <span className="tech-badge">PyTorch</span>
                <span className="tech-badge">Librosa</span>
                <span className="tech-badge">Spleeter</span>
                <span className="tech-badge">Magenta</span>
                <span className="tech-badge">Next.js</span>
                <span className="tech-badge">React</span>
                <span className="tech-badge">WebAudio API</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Genre Transformations */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Supported Genres</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="feature-icon mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Rock</h3>
              </div>
              <p>Our Rock transformation adds distorted guitars, compressed drums, and rock-style energy to your audio. Perfect for giving your track a powerful, gritty edge.</p>
              <div className="mt-4">
                <h4 className="font-medium">Characteristics:</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Guitar distortion and power chords</li>
                  <li>Strong, punchy drums</li>
                  <li>Compressed, energetic mix</li>
                  <li>Midrange emphasis</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="feature-icon mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Jazz</h3>
              </div>
              <p>Transform your track with a laid-back jazz feel featuring swing rhythm, complex harmonies, and warm tones. Ideal for a sophisticated, smooth feel.</p>
              <div className="mt-4">
                <h4 className="font-medium">Characteristics:</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Swing rhythm and timing</li>
                  <li>Harmonic complexity</li>
                  <li>Warm, rich tones</li>
                  <li>Subtle brushed percussion</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="feature-icon mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Electronic</h3>
              </div>
              <p>Convert your audio with synthesizers, beat effects, and electronic production techniques. Perfect for a modern, dance-floor ready sound.</p>
              <div className="mt-4">
                <h4 className="font-medium">Characteristics:</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Synthetic textures and effects</li>
                  <li>Heavy bass and sub frequencies</li>
                  <li>Sidechain compression</li>
                  <li>Digital processing artifacts</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className="feature-icon mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Classical</h3>
              </div>
              <p>Add orchestral elements, hall reverb, and classical dynamics to your audio. Transforms your track with an elegant, timeless quality.</p>
              <div className="mt-4">
                <h4 className="font-medium">Characteristics:</h4>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Orchestral textures and harmonies</li>
                  <li>Concert hall acoustics</li>
                  <li>Wide dynamic range</li>
                  <li>String and woodwind timbres</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Future Developments</h2>
        <div className="card glass-card">
          <div className="card-body">
            <p className="mb-6">
              We're constantly working to improve our technology and add more features to the Audio Genre Transformer. Our upcoming plans include:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-opacity-10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">New Genres</h3>
                <p className="mb-3">We're expanding our genre library to include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Hip Hop & Trap</li>
                  <li>Blues & Country</li>
                  <li>Reggae & Dub</li>
                  <li>Ambient & Cinematic</li>
                  <li>Folk & Acoustic</li>
                </ul>
              </div>
              
              <div className="bg-opacity-10 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Enhanced Features</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Fine-tuning controls for transformation parameters</li>
                  <li>Batch processing for multiple files</li>
                  <li>Style mixing between different genres</li>
                  <li>Advanced audio visualization</li>
                  <li>Artist-specific style modeling</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <p className="mb-4 text-lg">Want to be notified when we release new features?</p>
              <a href="#" className="btn btn-primary">Subscribe for Updates</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 gradient-text">Frequently Asked Questions</h2>
        <div className="card">
          <div className="card-body">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">What file formats are supported?</h3>
                <p>Currently, we support MP3 and WAV audio formats. We recommend using high-quality recordings for the best results.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How long does the transformation process take?</h3>
                <p>Transformation usually takes between 5-15 seconds depending on the length of your audio file and the complexity of the transformation.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Are there any file size limitations?</h3>
                <p>Yes, currently we support files up to 10MB in size. This is approximately 5-10 minutes of audio depending on the quality.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How accurate are the genre transformations?</h3>
                <p>Our AI has been trained on thousands of genre-specific music samples, but results may vary depending on the characteristics of your original audio. Complex mixes with multiple instruments tend to work best.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Do you store my uploaded audio files?</h3>
                <p>We temporarily store your files during processing, but they are automatically deleted after 24 hours. We respect your privacy and copyright ownership.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Footer CTA */}
      <section>
        <div className="card glass-card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Audio?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Experience the power of AI-driven audio transformation. Upload your track and hear it reimagined in a variety of musical genres.
            </p>
            <a href="/" className="btn btn-primary inline-block mx-auto">Try It Now</a>
          </div>
        </div>
      </section>
    </div>
  );
} 