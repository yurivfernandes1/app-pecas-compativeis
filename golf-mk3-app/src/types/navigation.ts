import { NavigationProp, RouteProp } from '@react-navigation/native';
import { Peca, CorVW, Fusivel } from './data';

// Main Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Pecas: undefined;
  Cores: undefined;
  Fusiveis: undefined;
};

// Stack Navigators
export type PecasStackParamList = {
  PecasList: { categoria?: string };
  PecaDetail: { peca: Peca };
  PecaSearch: { query?: string };
};

export type CoresStackParamList = {
  CoresGrid: undefined;
  CorDetail: { cor: CorVW };
};

export type FusiveisStackParamList = {
  FusiveisMap: undefined;
  FusivelDetail: { fusivel: Fusivel };
};

// Navigation Props
export type HomeScreenNavigationProp = NavigationProp<MainTabParamList, 'Home'>;
export type PecasScreenNavigationProp = NavigationProp<MainTabParamList, 'Pecas'>;
export type CoresScreenNavigationProp = NavigationProp<MainTabParamList, 'Cores'>;
export type FusiveisScreenNavigationProp = NavigationProp<MainTabParamList, 'Fusiveis'>;

// Route Props
export type PecasListRouteProp = RouteProp<PecasStackParamList, 'PecasList'>;
export type PecaDetailRouteProp = RouteProp<PecasStackParamList, 'PecaDetail'>;
export type CorDetailRouteProp = RouteProp<CoresStackParamList, 'CorDetail'>;
export type FusivelDetailRouteProp = RouteProp<FusiveisStackParamList, 'FusivelDetail'>;

// Combined Navigation Props
export type PecasListScreenProps = {
  navigation: NavigationProp<PecasStackParamList, 'PecasList'>;
  route: PecasListRouteProp;
};

export type PecaDetailScreenProps = {
  navigation: NavigationProp<PecasStackParamList, 'PecaDetail'>;
  route: PecaDetailRouteProp;
};

export type CorDetailScreenProps = {
  navigation: NavigationProp<CoresStackParamList, 'CorDetail'>;
  route: CorDetailRouteProp;
};

export type FusivelDetailScreenProps = {
  navigation: NavigationProp<FusiveisStackParamList, 'FusivelDetail'>;
  route: FusivelDetailRouteProp;
};