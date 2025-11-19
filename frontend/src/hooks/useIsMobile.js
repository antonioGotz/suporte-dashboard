import { useState, useEffect } from 'react';
import breakpoints from '../styles/breakpoints';

/**
 * Hook para detectar se o dispositivo é mobile baseado em um breakpoint
 * 
 * @param {number} breakpoint - Largura em pixels para considerar como mobile (padrão: 768)
 * @returns {boolean} - true se a largura da janela for menor que o breakpoint
 * 
 * @example
 * ```jsx
 * function MyComponent() {
 *   const isMobile = useIsMobile(); // usa 768px por padrão
 *   const isSmallScreen = useIsMobile(600); // customizado para 600px
 *   
 *   return (
 *     <div>
 *       {isMobile ? <MobileMenu /> : <DesktopMenu />}
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsMobile = (breakpoint = 768) => {
  // Estado inicial: verifica se está no servidor (SSR-safe)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    // Verifica se window está disponível (SSR-safe)
    if (typeof window === 'undefined') return;

    /**
     * Handler para atualizar o estado quando a janela for redimensionada
     */
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Configura o event listener
    window.addEventListener('resize', handleResize);

    // Chama uma vez para garantir que o estado está correto
    handleResize();

    // Cleanup: remove o event listener quando o componente for desmontado
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]); // Re-executa se o breakpoint mudar

  return isMobile;
};

/**
 * Hook para detectar se o dispositivo é tablet
 * Considera tablet: largura >= 768px e < 1024px
 * 
 * @returns {boolean} - true se estiver em modo tablet
 * 
 * @example
 * ```jsx
 * function MyComponent() {
 *   const isTablet = useIsTablet();
 *   
 *   return (
 *     <div className={isTablet ? 'tablet-layout' : ''}>
 *       Conteúdo
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.mobile && 
           window.innerWidth < breakpoints.tablet;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsTablet(
        window.innerWidth >= breakpoints.mobile && 
        window.innerWidth < breakpoints.tablet
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isTablet;
};

/**
 * Hook para detectar se o dispositivo é desktop
 * Considera desktop: largura >= 1024px e < 1440px
 * 
 * @returns {boolean} - true se estiver em modo desktop
 * 
 * @example
 * ```jsx
 * function MyComponent() {
 *   const isDesktop = useIsDesktop();
 *   
 *   return (
 *     <div>
 *       {isDesktop && <AdvancedFeatures />}
 *     </div>
 *   );
 * }
 * ```
 */
export const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.tablet && 
           window.innerWidth < breakpoints.desktop;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setIsDesktop(
        window.innerWidth >= breakpoints.tablet && 
        window.innerWidth < breakpoints.desktop
      );
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isDesktop;
};

/**
 * Hook para detectar o tipo de dispositivo baseado na largura da tela
 * 
 * @returns {'mobile' | 'tablet' | 'desktop' | 'wide'} - Tipo do dispositivo
 * 
 * @example
 * ```jsx
 * function MyComponent() {
 *   const deviceType = useDeviceType();
 *   
 *   const columns = {
 *     mobile: 1,
 *     tablet: 2,
 *     desktop: 3,
 *     wide: 4
 *   };
 *   
 *   return (
 *     <Grid columns={columns[deviceType]}>
 *       <Card />
 *       <Card />
 *       <Card />
 *     </Grid>
 *   );
 * }
 * ```
 * 
 * @example
 * ```jsx
 * // Usar com renderização condicional
 * function Dashboard() {
 *   const deviceType = useDeviceType();
 *   
 *   if (deviceType === 'mobile') {
 *     return <MobileDashboard />;
 *   }
 *   
 *   if (deviceType === 'tablet') {
 *     return <TabletDashboard />;
 *   }
 *   
 *   return <DesktopDashboard />;
 * }
 * ```
 */
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < breakpoints.mobile) return 'mobile';
    if (width < breakpoints.tablet) return 'tablet';
    if (width < breakpoints.desktop) return 'desktop';
    return 'wide';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < breakpoints.mobile) {
        setDeviceType('mobile');
      } else if (width < breakpoints.tablet) {
        setDeviceType('tablet');
      } else if (width < breakpoints.desktop) {
        setDeviceType('desktop');
      } else {
        setDeviceType('wide');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
};

// Export default do hook principal
export default useIsMobile;

