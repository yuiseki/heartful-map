export interface IPostCategory {
  name: string;
  icon: string;
  bgColor: string;
}

export const postCategories: IPostCategory[] = [
  {
    name: '子ども食堂',
    icon: '/images/map.bn_shokudo.png',
    bgColor: '#17a63c',
  },
  {
    name: 'フードバンク',
    icon: '/images/map.bn_pantori.png',
    bgColor: '#e9b104',
  },
  {
    name: 'フードパントリー',
    icon: '/images/map.bn_pantori.png',
    bgColor: '#e9b104',
  },
  { name: '相談', icon: '/images/map.bn_sodan.png', bgColor: '#923d11' },
  {
    name: '親子の居場所',
    icon: '/images/map.bn_ibasho.png',
    bgColor: '#e53530',
  },
  { name: '応援の案内所', icon: '/images/map.bn_jiin.png', bgColor: '#8f0b81' },
  { name: '学習支援', icon: '/images/map.bn_gakushu.png', bgColor: '#00b0ed' },
  { name: '育児支援', icon: '/images/map.bn_hoiku.png', bgColor: '#806122' },
  { name: '病児保育', icon: '/images/map.bn_hoiku.png', bgColor: '#806122' },
  { name: '介護支援', icon: '', bgColor: 'gray' },
];
