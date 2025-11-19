import { useState, useEffect } from 'react';

/**
 * Hook genérico para consultas de mídia usando window.matchMedia
 * Suporta navegadores antigos e modernos
 * 
 * @param {string} query - String de consulta de mídia CSS
 * @returns {boolean} - true se a consulta corresponder
 * 
 * @example
 * ```jsx
 * function MyComponent() {
 *   const isLargeScreen = useMediaQuery('(min-width: 1200px)');
 *   const prefersGrid = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
 *   
 *   return (
 *     <div>
 *       {isLargeScreen && <LargeScreenLayout />}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @example
 * ```jsx
 * // Usar com múltiplas queries
 * function ResponsiveImage() {
 *   const isRetina = useMediaQuery('(min-resolution: 2dppx)');
 *   const isLandscape = useMediaQuery('(orientation: landscape)');
 *   
 *   return (
 *     <img 
 *       src={isRetina ? 'image@2x.png' : 'image.png'}
 *       className={isLandscape ? 'landscape' : 'portrait'}
 *     />
 *   );
 * }
 * ```
 */
export const useMediaQuery = (query) => {
  // Estado inicial: verifica se está no servidor (SSR-safe)
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Verifica se window está disponível (SSR-safe)
    if (typeof window === 'undefined') return;

    // Cria o objeto MediaQueryList
    const mediaQuery = window.matchMedia(query);

    /**
     * Handler para atualizar o estado quando a consulta de mídia mudar
     * @param {MediaQueryListEvent} event - Evento da mudança
     */
    const handleChange = (event) => {
      setMatches(event.matches);
    };

    // Atualiza o estado inicial
    setMatches(mediaQuery.matches);

    // Suporte para navegadores modernos (addEventListener)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } 
    // Suporte para navegadores antigos (addListener) - deprecated mas necessário para compatibilidade
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    // Cleanup: remove o event listener quando o componente for desmontado
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]); // Re-executa se a query mudar

  return matches;
};

/**
 * Hook para detectar a orientação do dispositivo
 * 
 * @returns {'portrait' | 'landscape'} - Orientação atual do dispositivo
 * 
 * @example
 * ```jsx
 * function MyComponent() {
 *   const orientation = useOrientation();
 *   
 *   return (
 *     <div className={`container ${orientation}`}>
 *       <p>Orientação: {orientation}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useOrientation = () => {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  return isPortrait ? 'portrait' : 'landscape';
};

/**
 * Hook para detectar a preferência de esquema de cores do sistema
 * 
 * @returns {'light' | 'dark'} - Esquema de cores preferido
 * 
 * @example
 * ```jsx
 * function ThemeProvider({ children }) {
 *   const systemTheme = usePrefersColorScheme();
 *   const [theme, setTheme] = useState(systemTheme);
 *   
 *   return (
 *     <ThemeContext.Provider value={{ theme, setTheme }}>
 *       <div className={`theme-${theme}`}>
 *         {children}
 *       </div>
 *     </ThemeContext.Provider>
 *   );
 * }
 * ```
 */
export const usePrefersColorScheme = () => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  return prefersDark ? 'dark' : 'light';
};

/**
 * Hook para detectar se o usuário prefere movimento reduzido
 * Útil para acessibilidade - desabilitar animações para usuários sensíveis
 * 
 * @returns {boolean} - true se o usuário prefere movimento reduzido
 * 
 * @example
 * ```jsx
 * function AnimatedComponent() {
 *   const prefersReducedMotion = usePrefersReducedMotion();
 *   
 *   return (
 *     <motion.div
 *       animate={{ x: prefersReducedMotion ? 0 : 100 }}
 *       transition={{ duration: prefersReducedMotion ? 0 : 1 }}
 *     >
 *       Conteúdo animado
 *     </motion.div>
 *   );
 * }
 * ```
 */
export const usePrefersReducedMotion = () => {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
};

/**
 * Hook para detectar se o dispositivo suporta hover
 * Útil para diferenciar dispositivos touch de dispositivos com mouse
 * 
 * @returns {boolean} - true se o dispositivo suporta hover
 * 
 * @example
 * ```jsx
 * function InteractiveCard() {
 *   const canHover = useCanHover();
 *   
 *   return (
 *     <div 
 *       className={canHover ? 'hover-effects' : 'touch-effects'}
 *       onClick={canHover ? undefined : handleClick}
 *     >
 *       {canHover ? 'Passe o mouse' : 'Toque aqui'}
 *     </div>
 *   );
 * }
 * ```
 */
export const useCanHover = () => {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
};

/**
 * Hook para detectar se o dispositivo é touch
 * Complementar ao useCanHover, mas focado em capacidade touch
 * 
 * @returns {boolean} - true se o dispositivo é touch
 * 
 * @example
 * ```jsx
 * function SwipeableGallery() {
 *   const isTouchDevice = useIsTouchDevice();
 *   
 *   return (
 *     <div className={isTouchDevice ? 'swipeable' : 'clickable'}>
 *       {isTouchDevice ? (
 *         <SwipeGestures />
 *       ) : (
 *         <ArrowNavigation />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsTouchDevice = () => {
  return useMediaQuery('(pointer: coarse)');
};

/**
 * Hook para obter a largura atual do viewport
 * Atualiza em tempo real quando a janela é redimensionada
 * 
 * @returns {number} - Largura atual do viewport em pixels
 * 
 * @example
 * ```jsx
 * function ResponsiveChart() {
 *   const viewportWidth = useViewportWidth();
 *   
 *   return (
 *     <Chart 
 *       width={viewportWidth - 40} // 20px de padding em cada lado
 *       height={400}
 *     />
 *   );
 * }
 * ```
 */
export const useViewportWidth = () => {
  const [width, setWidth] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return window.innerWidth;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
};

/**
 * Hook para obter a altura atual do viewport
 * Atualiza em tempo real quando a janela é redimensionada
 * 
 * @returns {number} - Altura atual do viewport em pixels
 * 
 * @example
 * ```jsx
 * function FullHeightSection() {
 *   const viewportHeight = useViewportHeight();
 *   
 *   return (
 *     <section style={{ height: `${viewportHeight}px` }}>
 *       Seção de altura completa
 *     </section>
 *   );
 * }
 * ```
 * 
 * @example
 * ```jsx
 * // Útil para modais e overlays
 * function Modal() {
 *   const viewportHeight = useViewportHeight();
 *   const maxHeight = viewportHeight * 0.9; // 90% da altura da tela
 *   
 *   return (
 *     <div 
 *       className="modal"
 *       style={{ maxHeight: `${maxHeight}px` }}
 *     >
 *       Conteúdo do modal
 *     </div>
 *   );
 * }
 * ```
 */
export const useViewportHeight = () => {
  const [height, setHeight] = useState(() => {
    if (typeof window === 'undefined') return 0;
    return window.innerHeight;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return height;
};

// Export default do hook principal
export default useMediaQuery;

