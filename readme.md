[![Gitlab Pipeline](https://gitlab.com/luiz1361/luiz1361-github-io/badges/master/pipeline.svg)](https://gitlab.com/luiz1361/luiz1361-github-io/)

# Just Another Engineer | Yet another documentation repository

## Running it locally

### Mac OS X

```
brew install gnupg
gpg --keyserver hkp://keys.gnupg.net
    --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -sSL https://get.rvm.io | bash -s stable --ruby
rvm install 2.6.3
git clone https://github.com/luiz1361/luiz1361.github.io.git .
gem install bundler
bundle install
bundle exec jekyll serve
open http://127.0.0.1:4000
```
