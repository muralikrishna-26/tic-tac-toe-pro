import { GithubIcon } from './Icons.jsx';

// Replace this with your real repository URL after you create it on GitHub.
const REPO_URL = 'https://github.com/YOUR-USERNAME/tic-tac-toe-pro';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-name">Tic-Tac-Toe Pro</p>
          <p className="footer-meta">
            &copy; {new Date().getFullYear()} Tic-Tac-Toe Pro. Built with React and JavaScript.
          </p>
        </div>
        <a className="footer-link" href={REPO_URL} target="_blank" rel="noopener noreferrer">
          <GithubIcon />
          <span>View on GitHub</span>
        </a>
      </div>
    </footer>
  );
}
