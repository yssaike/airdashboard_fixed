#!/usr/bin/env python3
"""
Test Auto Commit Script - Non-interactive version for testing
"""

import os
import subprocess
import sys
import random
from datetime import datetime

def check_git_repo():
    """Check if we're in a git repository"""
    try:
        result = subprocess.run(['git', 'status'], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

def generate_realistic_commit_message():
    """Generate a realistic commit message"""
    commit_types = ["feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "build", "ci"]
    features = [
        "Add user authentication system",
        "Implement responsive design for mobile",
        "Add dark mode toggle",
        "Create reusable button component",
        "Add form validation",
        "Implement search functionality",
        "Add loading states",
        "Create navigation menu",
        "Add error handling",
        "Implement data caching"
    ]
    
    commit_type = random.choice(commit_types)
    if commit_type == "feat":
        message = random.choice(features)
    else:
        message = f"Update {commit_type} functionality"
    
    return f"{commit_type}: {message}"

def make_test_commits(num_commits=2):
    """Make test commits"""
    print(f'Making {num_commits} test commits...')
    
    for i in range(num_commits):
        try:
            # Create a small change
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            with open(f'test_commit_{i+1}.txt', 'w') as f:
                f.write(f'Test commit {i+1} - {timestamp}\n')
            
            # Add and commit with realistic message
            subprocess.run(['git', 'add', f'test_commit_{i+1}.txt'], check=True)
            commit_message = generate_realistic_commit_message()
            subprocess.run(['git', 'commit', '-m', commit_message], check=True)
            print(f'✓ Made test commit {i+1}/{num_commits}: {commit_message}')
            
        except subprocess.CalledProcessError as e:
            print(f'✗ Error making commit {i+1}: {e}')
            return False
        except Exception as e:
            print(f'✗ Unexpected error on commit {i+1}: {e}')
            return False
    
    return True

def push_commits():
    """Push commits to GitHub"""
    print('Pushing commits to GitHub...')
    try:
        subprocess.run(['git', 'push', 'origin', 'main'], check=True)
        print('✓ Successfully pushed commits to GitHub!')
        print(f'View your commits at: https://github.com/yssaike/airdashboard_fixed')
        return True
    except subprocess.CalledProcessError as e:
        print(f'✗ Error pushing to GitHub: {e}')
        return False

def cleanup():
    """Clean up test files"""
    try:
        for i in range(1, 6):  # Clean up test_commit_1.txt through test_commit_5.txt
            filename = f'test_commit_{i}.txt'
            if os.path.exists(filename):
                os.remove(filename)
                print(f'✓ Cleaned up {filename}')
    except Exception as e:
        print(f'Warning: Could not clean up test files: {e}')

def main():
    """Main function"""
    print("=== Test Auto Commit Script ===")
    print("Testing with 2 commits...")
    
    # Check if we're in a git repository
    if not check_git_repo():
        print('Error: Not in a git repository or git is not available')
        sys.exit(1)
    
    print('✓ Git repository detected')
    
    try:
        # Make test commits
        if make_test_commits(2):
            print('\n✓ Successfully made test commits!')
            
            # Push commits to GitHub
            if push_commits():
                print('\n🎉 Auto-commit script is working correctly with your new GitHub token!')
            else:
                print('\n⚠️  Commits were created locally but not pushed to GitHub.')
                print('This indicates an authentication issue with your GitHub token.')
        else:
            print('\n✗ Test commits failed')
            sys.exit(1)
            
    except KeyboardInterrupt:
        print('\n\nOperation cancelled by user')
        sys.exit(0)
    except Exception as e:
        print(f'\nUnexpected error: {e}')
        sys.exit(1)
    finally:
        cleanup()

if __name__ == '__main__':
    main()
