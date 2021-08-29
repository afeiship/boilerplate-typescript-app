import '@/setup';

class App {
  public static start() {
    console.log(nx.$args, nx.$conf.gets());
    console.log('hello app: 🥬', nx.VERSION);
  }
}

App.start();
