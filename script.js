/**
 * NEON MIRA Official Site — script.js
 */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  var STORAGE_KEY = 'neonMiraPlayer';

  var LYRICS = {
    'Angel.exe': {
      title: 'Angel.exe',
      lines: [
        '壊れた画面の向こうで',
        '君の名前だけが光ってる',
        'delete されそうな記憶の中',
        '最後の優しさを探してる',
        '',
        'Angel.exe — 夜が明ける前に',
        '届かない信号を送るよ',
        'クロームの雨に溶けていく',
        'デジタルの天使になって'
      ]
    },
    'Pink Signal': {
      title: 'Pink Signal',
      lines: [
        'ネオンの海を泳いで',
        'ピンクの信号を追いかけて',
        '途切れそうなこの想い',
        'まだ消えないでいて',
        '',
        'Pink signal — 夜の都市で',
        '君だけが見えていた',
        '甘く冷たい光の中',
        '名前を呼んで'
      ]
    },
    'Midnight Chrome': {
      title: 'Midnight Chrome',
      lines: [
        '深夜のビルが映り込む',
        '濡れた道路に反射して',
        'シルバーの夜を走る',
        '孤独なドライブ',
        '',
        'Midnight chrome — 街の灯り',
        '記憶の断片を照らす',
        '雨上がりの空の下',
        '明日へ向かって'
      ]
    },
    'Plastic Heaven': {
      title: 'Plastic Heaven',
      lines: [
        '作られた空の下で',
        '本物の涙を探してる',
        'プラスチックの楽園',
        '触れると消えそうで',
        '',
        'Plastic heaven — Y2Kの夢',
        '冷たい光に包まれて',
        '仮想の楽園の中',
        '心だけが残ってる'
      ]
    },
    'Blue Mirage': {
      title: 'Blue Mirage',
      lines: [
        '夜明け前の青い幻',
        '消えゆく信号を残して',
        '静かに終わるエンディング',
        'また会える日まで',
        '',
        'Blue mirage — 空が白む',
        '最後の光が揺れて',
        'デジタルの夜が明け',
        '新しい朝へ'
      ]
    }
  };

  var NeonPlayer = {
    state: { track: 'Angel.exe', playing: false },
    listeners: [],

    load: function () {
      try {
        var saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          var parsed = JSON.parse(saved);
          if (parsed && parsed.track) {
            this.state = parsed;
          }
        }
      } catch (e) {
        /* ignore */
      }
    },

    save: function () {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    },

    on: function (fn) {
      this.listeners.push(fn);
    },

    emit: function () {
      var self = this;
      this.listeners.forEach(function (fn) {
        fn(self.state);
      });
      this.updateHeader();
    },

    setTrack: function (name) {
      var changed = name !== this.state.track;
      this.state.track = name;
      this.save();
      this.emit();
      return changed;
    },

    setPlaying: function (playing) {
      this.state.playing = playing;
      this.save();
      this.emit();
    },

    toggle: function () {
      this.setPlaying(!this.state.playing);
    },

    updateHeader: function () {
      var trackEl = document.querySelector('.header-now-playing__track');
      var block = document.querySelector('.header-now-playing');
      var wave = document.querySelector('.waveform--header');
      if (trackEl) trackEl.textContent = this.state.track;
      if (block) {
        block.classList.toggle('header-now-playing--active', this.state.playing);
      }
      if (wave) {
        wave.classList.toggle('playing', this.state.playing);
      }
    }
  };

  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    if (prefersReduced) {
      reveals.forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initNav() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === '') currentPage = 'index.html';

    var navLinks = document.querySelectorAll('.header-nav a, .mobile-menu__nav a');
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  function initMobileMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    var menuLinks = menu.querySelectorAll('.mobile-menu__nav a');
    var closeBtn = menu.querySelector('.mobile-menu__close');

    function openMenu() {
      menu.removeAttribute('inert');
      toggle.classList.add('is-open');
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'メニューを閉じる');
      menu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      if (closeBtn) closeBtn.focus();
    }

    function closeMenu() {
      document.body.classList.remove('menu-open');
      toggle.focus();
      toggle.classList.remove('is-open');
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      menu.setAttribute('aria-hidden', 'true');
      menu.setAttribute('inert', '');
    }

    toggle.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    menuLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
    });
  }

  function bindPlayerUI(player) {
    if (!player) return;

    var playBtn = player.querySelector('.player-btn');
    var trackNameEl = player.querySelector('.player-track-name');
    var statusEl = player.querySelector('.player-status');
    var progressBar = player.querySelector('.player-progress__bar');
    var playerWaveform = player.querySelector('.player-waveform');
    var trackCards = document.querySelectorAll('.track-card--clickable');

    function updatePlayingLabels(state) {
      trackCards.forEach(function (card) {
        var label = card.querySelector('.track-playing-label');
        if (!label) return;
        label.hidden = !(card.dataset.track === state.track && state.playing);
      });
    }

    function resetProgress() {
      if (!progressBar) return;
      progressBar.classList.remove('animating');
      progressBar.style.width = '0%';
      void progressBar.offsetWidth;
      progressBar.style.width = '';
      if (NeonPlayer.state.playing) {
        progressBar.classList.add('animating');
      }
    }

    function render(state) {
      if (trackNameEl) trackNameEl.textContent = state.track;
      if (playBtn) playBtn.classList.toggle('playing', state.playing);
      if (statusEl) {
        statusEl.textContent = state.playing ? '再生中' : '停止中';
        statusEl.classList.toggle('playing', state.playing);
      }
      if (progressBar) {
        progressBar.classList.toggle('animating', state.playing);
        if (!state.playing) {
          progressBar.style.width = progressBar.style.width || '0%';
        } else {
          progressBar.style.width = '';
        }
      }
      if (playerWaveform) {
        playerWaveform.classList.toggle('playing', state.playing);
      }
      trackCards.forEach(function (card) {
        card.classList.toggle('track-card--active', card.dataset.track === state.track);
      });
      updatePlayingLabels(state);
      player.classList.toggle('music-player--active', state.playing);
    }

    var lastTrack = NeonPlayer.state.track;

    NeonPlayer.on(function (state) {
      if (state.track !== lastTrack && state.playing) resetProgress();
      lastTrack = state.track;
      render(state);
    });

    if (playBtn) {
      playBtn.addEventListener('click', function () {
        NeonPlayer.toggle();
      });
    }

    trackCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (e.target.closest('.track-lyrics-btn')) return;
        var name = card.dataset.track;
        var changed = NeonPlayer.setTrack(name);
        if (!NeonPlayer.state.playing) {
          NeonPlayer.setPlaying(true);
        } else if (changed) {
          resetProgress();
        }
      });
    });

    render(NeonPlayer.state);
  }

  function initGlobalPlayer() {
    NeonPlayer.load();

    var isMusicPage = document.body.classList.contains('page-music');
    if (isMusicPage && !sessionStorage.getItem(STORAGE_KEY)) {
      NeonPlayer.state.playing = true;
      NeonPlayer.save();
    }

    NeonPlayer.updateHeader();
    bindPlayerUI(document.getElementById('music-player') || document.getElementById('global-player'));
  }

  function initLyricsModal() {
    var modal = document.getElementById('lyrics-modal');
    if (!modal) return;

    var backdrop = modal.querySelector('.lyrics-modal__backdrop');
    var closeBtn = modal.querySelector('.lyrics-modal__close');
    var titleEl = modal.querySelector('.lyrics-modal__title');
    var bodyEl = modal.querySelector('.lyrics-modal__body');

    function openLyrics(trackName) {
      var data = LYRICS[trackName];
      if (!data) return;

      titleEl.textContent = data.title;
      bodyEl.innerHTML = data.lines
        .map(function (line) {
          return line ? '<p>' + line + '</p>' : '<br>';
        })
        .join('');

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lyrics-open');
      closeBtn.focus();
    }

    function closeLyrics() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lyrics-open');
    }

    document.querySelectorAll('.track-lyrics-btn').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openLyrics(btn.dataset.lyrics);
      });
    });

    closeBtn.addEventListener('click', closeLyrics);
    backdrop.addEventListener('click', closeLyrics);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeLyrics();
    });
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var messageEl = document.getElementById('form-message');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (messageEl) {
        messageEl.textContent = 'CHROME SIGNAL RECORDS へメッセージを送信しました。';
        messageEl.classList.add('show');
      }
      form.reset();
      setTimeout(function () {
        if (messageEl) messageEl.classList.remove('show');
      }, 5000);
    });
  }

  function initAmbientLight() {
    var ambient = document.querySelector('.ambient-bg');
    if (!ambient || prefersReduced || isMobile) return;

    var orb = document.createElement('div');
    orb.className = 'ambient-orb';
    orb.style.cssText =
      'position:absolute;width:300px;height:300px;border-radius:50%;' +
      'background:radial-gradient(circle,rgba(255,45,149,0.06) 0%,transparent 70%);' +
      'pointer-events:none;transition:transform 0.1s ease-out;';
    ambient.appendChild(orb);

    document.addEventListener('mousemove', function (e) {
      var x = (e.clientX / window.innerWidth - 0.5) * 40;
      var y = (e.clientY / window.innerHeight - 0.5) * 40;
      orb.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
  }

  function initImageFade() {
    document.querySelectorAll('.img-fade').forEach(function (img) {
      function show() { img.classList.add('loaded'); }
      if (img.complete) show();
      else {
        img.addEventListener('load', show, { once: true });
        img.addEventListener('error', show, { once: true });
      }
    });
  }

  function initHeroParallax() {
    if (prefersReduced || isMobile) return;
    var heroBgs = document.querySelectorAll('.hero-bg__img');
    if (!heroBgs.length) return;

    var ticking = false;
    document.addEventListener('mousemove', function (e) {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () {
          heroBgs.forEach(function (img) {
            var rect = img.closest('.hero-bg').getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) return;
            var x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
            var y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
            img.style.transform = 'scale(1.08) translate(' + x + 'px, ' + y + 'px)';
          });
          ticking = false;
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initNav();
    initMobileMenu();
    initGlobalPlayer();
    initLyricsModal();
    initContactForm();
    initAmbientLight();
    initImageFade();
    initHeroParallax();
  });
})();
