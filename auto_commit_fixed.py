#!/usr/bin/env python3
"""
Auto Commit Script - Interactive Version
This script prompts the user for the number of commits to make and creates them automatically.
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

def get_commit_count():
    """Get the number of commits from user input"""
    while True:
        try:
            num_commits = input('How many commits do you want to make? ')
            num_commits = int(num_commits)
            if num_commits > 0:
                return num_commits
            else:
                print('Please enter a positive number')
        except ValueError:
            print('Please enter a valid number')
        except KeyboardInterrupt:
            print('\nOperation cancelled')
            sys.exit(0)

def generate_realistic_commit_message():
    """Generate a realistic commit message"""
    commit_types = [
        "feat", "fix", "docs", "style", "refactor", "perf", "test", "chore", "build", "ci"
    ]
    
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
        "Implement data caching",
        "Add unit tests",
        "Create API integration",
        "Add accessibility features",
        "Implement lazy loading",
        "Add internationalization support",
        "Create dashboard widgets",
        "Add real-time updates",
        "Implement file upload",
        "Add data visualization",
        "Create user profile page"
    ]
    
    fixes = [
        "Fix memory leak in component",
        "Resolve navigation bug",
        "Fix responsive layout issues",
        "Correct API endpoint URL",
        "Fix form submission error",
        "Resolve state management issue",
        "Fix authentication token expiry",
        "Correct data validation logic",
        "Fix performance bottleneck",
        "Resolve CSS conflicts",
        "Fix mobile viewport issues",
        "Correct error message display",
        "Fix data synchronization",
        "Resolve build configuration",
        "Fix accessibility compliance"
    ]
    
    improvements = [
        "Improve code readability",
        "Optimize bundle size",
        "Enhance user experience",
        "Refactor component structure",
        "Update dependencies",
        "Improve error messages",
        "Optimize database queries",
        "Enhance security measures",
        "Improve loading performance",
        "Refactor API calls",
        "Update documentation",
        "Improve test coverage",
        "Enhance mobile responsiveness",
        "Optimize image loading",
        "Improve code organization"
    ]
    
    # Choose random type and message
    commit_type = random.choice(commit_types)
    
    if commit_type == "feat":
        message = random.choice(features)
    elif commit_type == "fix":
        message = random.choice(fixes)
    else:
        message = random.choice(improvements)
    
    # Sometimes add a detailed description
    if random.random() < 0.3:  # 30% chance
        details = [
            "Update component props and styling",
            "Add proper error boundaries",
            "Implement proper TypeScript types",
            "Add comprehensive test cases",
            "Update README with new features",
            "Improve code documentation",
            "Add proper loading indicators",
            "Implement proper state management"
        ]
        message += f"\n\n{random.choice(details)}"
    
    return f"{commit_type}: {message}"

def make_commits(num_commits):
    """Make the specified number of commits"""
    print(f'Making {num_commits} commits...')
    
    for i in range(num_commits):
        try:
            # Create a small change
            timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            with open('temp_commit.txt', 'w') as f:
                f.write(f'Development update {i+1} - {timestamp}\n')
            
            # Add and commit with realistic message
            subprocess.run(['git', 'add', 'temp_commit.txt'], check=True)
            commit_message = generate_realistic_commit_message()
            subprocess.run(['git', 'commit', '-m', commit_message], check=True)
            print(f'✓ Made commit {i+1}/{num_commits}: {commit_message.split(chr(10))[0]}')
            
        except subprocess.CalledProcessError as e:
            print(f'✗ Error making commit {i+1}: {e}')
            return False
        except Exception as e:
            print(f'✗ Unexpected error on commit {i+1}: {e}')
            return False
    
    return True

def cleanup():
    """Clean up temporary files"""
    try:
        if os.path.exists('temp_commit.txt'):
            os.remove('temp_commit.txt')
            print('✓ Cleaned up temporary files')
    except Exception as e:
        print(f'Warning: Could not clean up temp files: {e}')

def main():
    """Main function"""
    print("=== Auto Commit Script ===")
    
    # Check if we're in a git repository
    if not check_git_repo():
        print('Error: Not in a git repository or git is not available')
        print('Please run this script from within a git repository')
        sys.exit(1)
    
    print('✓ Git repository detected')
    
    try:
        # Get number of commits from user
        num_commits = get_commit_count()
        
        # Confirm before proceeding
        confirm = input(f'Are you sure you want to make {num_commits} commits? (y/N): ')
        if confirm.lower() not in ['y', 'yes']:
            print('Operation cancelled')
            sys.exit(0)
        
        # Make the commits
        if make_commits(num_commits):
            print(f'\n✓ Successfully made {num_commits} commits!')
            
            # Push commits to GitHub
            print('Pushing commits to GitHub...')
            try:
                subprocess.run(['git', 'push', 'origin', 'main'], check=True)
                print('✓ Successfully pushed commits to GitHub!')
                print(f'View your commits at: https://github.com/yssaike/airdashboard_fixed')
            except subprocess.CalledProcessError as e:
                print(f'✗ Error pushing to GitHub: {e}')
                print('Commits were created locally but not pushed to GitHub.')
                print('You can manually push them later with: git push origin main')
        else:
            print('\n✗ Some commits failed')
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
