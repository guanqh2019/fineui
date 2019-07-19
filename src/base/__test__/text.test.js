/**
 * Created by windy on 2018/01/23.
 */
describe("TextTest", function () {

    /**
     * test_author_windy
     */
    it("setText", function () {
        var text = BI.Test.createWidget({
            type: "bi.text"
        });
        text.setText("AAA");
        expect(text.element.text()).to.equal("AAA");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("setStyle", function () {
        var text = BI.Test.createWidget({
            type: "bi.text"
        });
        text.setStyle({"color": "red"});
        expect(text.element.getStyle("color")).to.equal("rgb(255, 0, 0)");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("高亮doHighlight", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "AAA",
            highLight: true
        });
        expect(text.element.getStyle("color")).to.equal("rgb(54, 133, 242)");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("标红doRedMark", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是要标红的A",
            keyword: "A"
        });
        expect(text.element.children(".bi-keyword-red-mark").length).to.not.equal(0);
        text.destroy();
    });


    /**
     * test_author_windy
     */
    it("取消高亮undoHighlight", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "AAA",
            highLight: true
        });
        text.unHighLight();
        expect(text.element.getStyle("color")).to.not.equal("rgb(54, 133, 242)");
        text.destroy();
    });

    /**
     * test_author_windy
     */
    it("取消标红undoRedMark", function () {
        var text = BI.Test.createWidget({
            type: "bi.text",
            text: "我是要标红的A",
            keyword: "A"
        });
        text.unRedMark();
        expect(text.element.children(".bi-keyword-red-mark").length).to.equal(0);
        text.destroy();
    });
});
