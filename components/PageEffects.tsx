'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface PageEffectsProps {
  effects?: {
    sakura?: boolean;
    snow?: boolean;
    stars?: boolean;
  };
}

export default function PageEffects({ effects }: PageEffectsProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // 延迟加载动画效果，避免阻塞首屏渲染
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300); // 延迟300ms加载动画
    
    return () => clearTimeout(timer);
  }, []);

  if (!effects || !isLoaded) return null;

  return (
    <>
      {effects.sakura && <SakuraEffect />}
      {effects.snow && <SnowEffect />}
      {effects.stars && <StarsEffect />}
    </>
  );
}

// 樱花粒子类（优化版）
class SakuraPetal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  fadeSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = -20;
    this.size = 8 + Math.random() * 12; // 8-20px
    this.speedX = (Math.random() - 0.5) * 1.5; // 左右飘动
    this.speedY = 1.5 + Math.random() * 1; // 下落速度
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 3;
    this.opacity = 0.5 + Math.random() * 0.4;
    this.fadeSpeed = 0.002 + Math.random() * 0.003;
  }

  update(canvasHeight: number) {
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    
    // 添加飘动效果
    this.speedX += (Math.random() - 0.5) * 0.1;
    this.speedX = Math.max(-2, Math.min(2, this.speedX));
    
    // 越界重置
    if (this.y > canvasHeight || this.opacity <= 0) {
      return true;
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    
    // 简化绘制，使用圆形代替复杂花瓣
    ctx.fillStyle = '#FFB7D5';
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 花蕊
    ctx.fillStyle = '#FFF0F5';
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// 樱花飘落效果（优化版）
function SakuraEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<SakuraPetal[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 减少初始樱花数量，逐步加载以提升首屏性能
    const maxPetals = 20; // 从30减少到20
    const initialPetals = 10; // 初始只加载10个
    
    // 初始加载少量樱花
    for (let i = 0; i < initialPetals; i++) {
      petalsRef.current.push(new SakuraPetal(canvas.width, canvas.height));
      petalsRef.current[i].y = Math.random() * canvas.height; // 初始分布
    }
    
    // 延迟加载剩余樱花
    const loadTimer = setTimeout(() => {
      for (let i = initialPetals; i < maxPetals; i++) {
        petalsRef.current.push(new SakuraPetal(canvas.width, canvas.height));
        petalsRef.current[i].y = Math.random() * canvas.height;
      }
    }, 500);

    // 使用时间戳控制帧率，避免过度渲染
    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      
      // 限制帧率为30fps，减少计算量
      if (deltaTime < 33) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和绘制所有樱花
      petalsRef.current = petalsRef.current.filter(petal => {
        const shouldRemove = petal.update(canvas.height);
        if (!shouldRemove) {
          petal.draw(ctx);
        }
        return !shouldRemove;
      });

      // 添加新樱花
      while (petalsRef.current.length < maxPetals) {
        petalsRef.current.push(new SakuraPetal(canvas.width, canvas.height));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}

// 雪花粒子类（优化版）
class Snowflake {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  swing: number;
  swingSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = -20;
    this.size = 3 + Math.random() * 5; // 3-8px
    this.speedY = 1 + Math.random() * 1.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.opacity = 0.6 + Math.random() * 0.4;
    this.swing = 0;
    this.swingSpeed = 0.02 + Math.random() * 0.03;
  }

  update(canvasHeight: number) {
    this.swing += this.swingSpeed;
    this.x += Math.sin(this.swing) * 0.5 + this.speedX;
    this.y += this.speedY;

    if (this.y > canvasHeight) {
      return true;
    }
    return false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#FFFFFF';
    
    // 简化为圆形，减少绘制复杂度
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// 雪花飘落效果（优化版）
function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 减少雪花数量
    const maxSnowflakes = 30; // 从50减少到30
    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakesRef.current.push(new Snowflake(canvas.width, canvas.height));
      snowflakesRef.current[i].y = Math.random() * canvas.height;
    }

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      
      // 限制帧率为30fps
      if (deltaTime < 33) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      snowflakesRef.current = snowflakesRef.current.filter(flake => {
        const shouldRemove = flake.update(canvas.height);
        if (!shouldRemove) {
          flake.draw(ctx);
        }
        return !shouldRemove;
      });

      while (snowflakesRef.current.length < maxSnowflakes) {
        snowflakesRef.current.push(new Snowflake(canvas.width, canvas.height));
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}

// 星星粒子类（优化版）
class Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  fadeDirection: number;
  fadeSpeed: number;
  twinkle: number;
  twinkleSpeed: number;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.size = 1 + Math.random() * 2.5;
    this.opacity = Math.random();
    this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
    this.fadeSpeed = 0.01 + Math.random() * 0.02;
    this.twinkle = 0;
    this.twinkleSpeed = 0.05 + Math.random() * 0.1;
  }

  update() {
    this.opacity += this.fadeDirection * this.fadeSpeed;
    if (this.opacity >= 1) {
      this.opacity = 1;
      this.fadeDirection = -1;
    } else if (this.opacity <= 0) {
      this.opacity = 0;
      this.fadeDirection = 1;
    }
    
    this.twinkle += this.twinkleSpeed;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    
    // 简化绘制，只画圆形
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// 星光闪烁效果（优化版）
function StarsEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 重新生成星星位置，减少数量
      starsRef.current = [];
      const maxStars = 50; // 从80减少到50
      for (let i = 0; i < maxStars; i++) {
        starsRef.current.push(new Star(canvas.width, canvas.height));
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = (timestamp: number) => {
      const deltaTime = timestamp - lastTimeRef.current;
      
      // 限制帧率为30fps
      if (deltaTime < 33) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      lastTimeRef.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach(star => {
        star.update();
        star.draw(ctx);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
}

