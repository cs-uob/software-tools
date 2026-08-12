package softwaretools.server02.model;

public class Pair<A, B> {
    A a;
    B b;
    
    public Pair(A a, B b) {
        this.a = a;
        this.b = b;
    }
    
    public A getFirst() {
        return this.a;
    }
    
    public B getSecond() {
        return this.b;
    }
}
