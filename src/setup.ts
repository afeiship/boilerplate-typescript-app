import '@/types';
import argsParser from 'args-parser';
import '@jswork/next-require';

nx.require({
  pattern: ['@jswork/next-*', '@afeiship/next-*', '!@jswork/next-require'],
  scope: ['dependencies']
});

const $args = argsParser(process.argv);
const $conf = new nx.YamlConfiguration({ path: './config.yml' });

nx.sets({ $args, $conf });
